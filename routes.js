module.exports = app => {
    // router-related dependencies
    const async = require('async');
    const request = require('request');
    const xml2js = require('xml2js');
    const jwt = require('express-jwt');

    // set up JWT
    const jwtCheck = jwt({
        secret: new Buffer(process.env.JWT_SECRET, 'base64'),
        audience: process.env.JWT_AUDIENCE
    });

    app.post('/check-profile', jwtCheck, (req, res) => {
        const profile = req.body;
        console.log('Profile received: ', profile);

        if (!isProfileValid(res, profile)) return;
        // TODO: check if the user exists, if yes, check if he's been blocked, if no, create one

        console.log('Profile passed correctly: ', profile);
        res.status(200).send('Success, mate!');
    });

    // TODO: move these to a helper
    function isValidString(val) {
        return typeof val === 'string' && val.trim() !== '';
    }

    function isProfileValid(res, profile) {
        if (!profile) {
            const msg = 'Profile not defined';
            console.error(msg);
            res.status(401).send(msg);

            return false;
            // TODO: replace this with authId (need to check what's there for GOOGLE and FB)
        } else if (!isValidString(profile.email)) {
            const msg = 'Profile e-mail not defined properly';
            console.error(msg);
            res.status(401).send(msg);

            return false;
        }

        return true;
    }
};