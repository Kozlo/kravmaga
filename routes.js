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

    app.post('/auth-test', jwtCheck, (req, res) => {
        console.log(req.body.message);
        res.json({ message: 'Success, mate!'});
    });
};