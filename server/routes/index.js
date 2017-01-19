/**
 * Index routes.
 */
module.exports = app => {

    const auth = require('express-jwt')({
        secret: process.env.JWT_SECRET,
        userProperty: 'payload'
    });
    const indexController = require('../controllers/index');

    require('./auth')(app, auth);
    require('./users')(app, auth);

    app.get('*', indexController.main);

};
