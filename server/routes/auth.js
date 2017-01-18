/**
 * Authentication routes.
 */
module.exports = app => {

    const auth = require('../controllers/auth');

    // TODO: check if a logout route is necessary

    app.post('/login', auth.login);
};
