module.exports = app => {
    // router-related dependencies
    const async = require('async');
    const request = require('request');
    const xml2js = require('xml2js');
    const jwt = require('express-jwt');

    // models
    const User = require('../models/user');

    // set up JWT
    // const jwtCheck = jwt({
    //     secret: new Buffer(process.env.JWT_SECRET, 'base64'),
    //     audience: process.env.JWT_AUDIENCE
    // });

    // app.post('/get-auth0-config', (req, res) => {
    //     const jwt_audience = process.env.JWT_AUDIENCE;
    //     const auth0_id = process.env.AUTH0_ID;
    //
    //     if (!jwt_audience) return handleError(res, null, 'JWT_AUDIENCE environmental variable not set', 500);
    //     if (!auth0_id) return handleError(res, null, 'AUTH0_ID environmental variable not set', 500);
    //
    //     console.log('Returning jwt, auth0 environmental variables: ', jwt_audience, auth0_id);
    //
    //     res.status(200).json({ jwt_audience, auth0_id });
    // });

    // app.post('/get-profile', jwtCheck, );

    // app.post('/check-profile', jwtCheck, (req, res) => {
    //     const profile = req.body;
    //
    //     // TODO: add an error handler
    //     if (!isProfileValid(res, profile)) return;
    //
    //     const criteria = { user_id: profile.user_id };
    //     const fields = 'user_id is_blocked email firstName, lastName';
    //
    //     User.findOne(criteria, fields)
    //         .then(user => {
    //             if (!user) return createUser(profile).save();
    //
    //             console.log('Found user:', user);
    //
    //             return updateUser(user, profile).save();
    //         })
    //         .then(user => {
    //             if (!user.is_blocked) {
    //                 res.status(200).send('Success, mate!');
    //             } else {
    //                 res.status(403).send('User is blocked!');
    //             }
    //         })
    //         .catch(err => handleError(res, err, 'Error checking profile'));
    // });

};