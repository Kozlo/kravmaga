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

    app.post('/get-auth0-config', (req, res) => {
        const jwt_audience = process.env.JWT_AUDIENCE;
        const auth0_id = process.env.AUTH0_ID;

        if (!jwt_audience) return handleError(res, null, 'JWT_AUDIENCE environmental variable not set', 500);
        if (!auth0_id) return handleError(res, null, 'AUTH0_ID environmental variable not set', 500);

        console.log('Returning jwt, auth0 environmental variables: ', jwt_audience, auth0_id);

        res.status(200).json({ jwt_audience, auth0_id });
    });

    app.post('/get-profile', jwtCheck, (req, res) => {
        const user_id = req.body.user_id;
        console.log('Retrieving profile for user with id: ', user_id);

        if (!isValidString(user_id)) return handleError(res, null, 'user_id not defined', 401);

        const criteria = { user_id };

        User.findOne(criteria)
            .then(user => {
                if (!user) return handleError(res, null, `user with id ${user_id} not found`, 401);
                if (user.is_blocked) return handleError(res, null, `user with id ${user_id} is blocked`, 403);

                console.log('Found user:', user);

                res.status(200).send(user);
            })
            .catch(err => handleError(res, err, 'Error checking profile'));
    });

    app.post('/check-profile', jwtCheck, (req, res) => {
        const profile = req.body;
        console.log('Profile received: ', profile);

        if (!isProfileValid(res, profile)) return;

        const criteria = { user_id: profile.user_id };
        const fields = 'user_id is_blocked email firstName, lastName';

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
     * @param {string} [msg] Error message
     * @param {number} [status] Status code
     */
    function handleError(res, err, msg = 'Internal server error', status = 500) {
        res.status(status).send(msg);
        console.error(msg, err);
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
        } else if (!isValidString(profile.user_id)) {
            const msg = 'Profile user_id not defined properly';
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
            user_id: profile.user_id
        };

        if (profile.email) user.email = profile.email;
        if (profile.given_name) user.firstName = profile.given_name;
        if (profile.family_name) user.lastName = profile.family_name;
        if (profile.gender) user.gender = profile.gender;
        if (profile.picture) user.picture = profile.picture;

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

        console.log('Updating user:', user);

        return user;
    }
};