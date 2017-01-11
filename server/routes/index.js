/**
 * Index routes.
 */
module.exports = app => {

    const auth = require('express-jwt')({
        secret: new Buffer(process.env.JWT_SECRET, 'base64'),
        audience: process.env.JWT_AUDIENCE,
        userProperty: 'payload'
    });
    const controller = require('../controllers/index');

    require('./auth')(app, auth);
    require('./users')(app, auth);

    app.get('*', controller.main);

};
