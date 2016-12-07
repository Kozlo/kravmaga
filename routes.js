module.exports = app => {
    // router-related dependencies
    const async = require('async');
    const request = require('request');
    const xml2js = require('xml2js');
    const jwt = require('express-jwt');

    // models
    const User = require('./models/user');
    const AuthProvider = require('./models/auth-provider');

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
        console.log('Searching for user:', profile);
        // TODO: check if the user exists, if yes, check if he's been blocked, if no, create one
        User.findOne(criteria, fields, function(err, user) {
            if (err) return handleError(res, err, 'Error finding user');

            // TODO: if no user is found, create one

            // TODO: if the user is blocked, send 403 message

            // TODO: if user is found, check is any of the fields are empty, update if possible (if not, leave them as they are). this is needed in case a user adds a social profile and there's extra new info
            console.log('Found user:', user);

            console.log('Profile passed correctly: ', profile);
            res.status(200).send('Success, mate!');
        });
    });

    // TODO: move these to a helper
    function handleError(res, err, msg = 'Internal server error') {
        res.status(500).send();
        throw err;
    }

    function isValidString(val) {
        return typeof val === 'string' && val.trim() !== '';
    }

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
};