/**
 * Authentication routes.
 */
module.exports = app => {

    const auth = require('../controllers/auth');

    // TODO: check if a logout route is necessary

    // TODO: change front-end references
    app.get('/auth-config', auth.getConfig);

};