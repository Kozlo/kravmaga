/**
 * Authentication routes.
 */
module.exports = (app, auth) => {

    const authController = require('../controllers/auth');

    // TODO: check if a logout route is necessary

    app.get('/auth-config', authController.getConfig);

    app.post('/check-profile', auth, authController.checkProfile);
};
