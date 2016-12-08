module.exports = app => {
    // router-related dependencies
    const async = require('async');
    const request = require('request');
    const xml2js = require('xml2js');
    const jwt = require('express-jwt');

    // models
    const User = require('./models/user');

    // set up JWT
    const jwtCheck = jwt({
        secret: new Buffer(process.env.JWT_SECRET, 'base64'),
        audience: process.env.JWT_AUDIENCE
    });

    app.post('/check-profile', jwtCheck, (req, res) => {
        const profile = req.body;
        console.log('Profile received: ', profile);

        if (!isProfileValid(res, profile)) return;

        const criteria = { auth_client_id: profile.clientID };
        const fields = 'is_blocked auth_providers email, name, gender, picture';

        User.findOne(criteria, fields)
            .then(user => {
                if (!user) return createUser(profile).save();

                console.log('Found user:', user);

                return updateUser(user, profile).save();
            })
            .then(user => {
                if (!user.is_blocked) {
                    res.status(200).send('Success, mate!');
                } else {
                    res.status(403).send('User is blocked!');
                }
            })
            .catch(err => handleError(res, err, 'Error checking profile'));
    });

    /**
     * Error handler that sends a response with an error and throws the error on the server.
     *
     * @public
     * @param {Object} res Response object
     * @param {Object} err Error object
     * @param {String} [msg] Error message
     */
    function handleError(res, err, msg = 'Internal server error') {
        res.status(500).send();
        throw err;
    }

    /**
     * Checks if the passed string is valid.
     * Also trips the spaces from the start/end.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is a valid string.
     */
    function isValidString(val) {
        return typeof val === 'string' && val.trim() !== '';
    }

    /**
     * Checks if the profile has the necessary mandatory properties.
     *
     * @public
     * @param {Object} res Response to use in case of errors.
     * @param {Object} profile Profile user is using to log in.
     * @returns {boolean} Flag showing if the profile is valid.
     */
    function isProfileValid(res, profile) {
        if (!profile) {
            const msg = 'Profile not defined';
            console.error(msg);
            res.status(401).send(msg);

            return false;
        } else if (!isValidString(profile.clientID)) {
            const msg = 'Profile clientID not defined properly';
            console.error(msg);
            res.status(401).send(msg);

            return false;
        }

        return true;
    }

    /**
     * Creates a new user based on the passed profile. Tries to extract usable data from the profile.
     *
     * @param {Object} profile Profile the user is using to log in.
     * @returns {User} Created user.
     */
    function createUser( profile) {
        let user = {
            auth_client_id: profile.clientID,
            auth_providers: []
        };

        if (profile.email) user.email = profile.email;
        if (profile.given_name) user.firstName = profile.given_name;
        if (profile.family_name) user.lastName = profile.family_name;
        if (profile.gender) user.gender = profile.gender;
        if (profile.picture) user.picture = profile.picture;
        _addAuthProviders(user, profile);

        console.log('Creating new user:', user);

        return new User(user);
    }

    /**
     * Checks if the user has some info that's not already in the database and exists for the passed profile.
     *
     * @public
     * @param {User} user User to update.
     * @param {Object} profile Profile the user is trying to log on with.
     * @returns {User}
     */
    function updateUser(user, profile) {
        if (!user.email && profile.email) user.email = profile.email;
        if (!user.given_name && profile.given_name) user.firstName = profile.given_name;
        if (!user.family_name && profile.family_name) user.lastName = profile.family_name;
        if (!user.gender && profile.gender) user.gender = profile.gender;
        if (!user.picture && profile.picture) user.picture = profile.picture;
        _addAuthProviders(user, profile, true);

        console.log('Updating user:', user);

        return user;
    }

    /**
     * Creates new or checks if new have to be added to the user's profile.
     *
     * @private
     * @param {User|Object} user User whose profile is being updated.
     * @param {Object} profile Identities the user is logging in with.
     * @param {boolean} [update] Flag showing is the identities are being updated or added.
     */
    function _addAuthProviders(user, profile, update = false) {
        let provider = profile['identities[0][provider]'];
        let userId = profile['identities[0][user_id]'];
        let connection = profile['identities[0][connection]'];
        let isSocial = profile['identities[0][isSocial]'];

        if (!provider || !userId || !connection || !isSocial) {
            console.log('Could not read identity from profile, skipping...');
            return;
        }

        if (update && _authProviderExists(user.auth_providers, userId, provider)) {
            console.log(`Provider for ${provider} already exists, skipping...`);
            return;
        }

        console.log('Adding auth providers');

        // need to convert isSocial from string to boolean
        user.auth_providers.push({
            connection: connection,
            is_social: !!isSocial,
            provider: provider,
            user_id: userId
        });
    }

    /**
     * Checks if the provider has already been added to the user's profile based on provider name and user id.
     *
     * @private
     * @param {Array} providers User's existing providers.
     * @param {Array} id Id of the provider the user is logging in with.
     * @param {Array} providername Name of the provider the user is logging in with.
     * @returns {boolean} Indicator showing if the provider already exists.
     */
    function _authProviderExists(identities, userId, providerName) {
        return identities.filter(identity => {
            return (identity.user_id == userId && identity.provider == providerName);
        }).length > 0;
    }
};