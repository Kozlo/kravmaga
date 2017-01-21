/**
 * Authentication controller.
 */

const helpers = require('../helpers/index');
const userHelpers = require('../helpers/users');
const User = require('../models/user');

module.exports = {

    /**
     * Attempts to login the user using the local authentication strategy.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     */
    login: (req, res) => {
        passport.authenticate('local', (err, user, info) => {
            // If Passport throws/catches an error
            if (err) throw err;//;return helpers.handleError(res, err, `Error finding user ${user}`, 500);

            // If a user is found
            if (user){
                // TODO: instead of returning all info only return the relevant one (e.g. no hash or salt)
                res.status(200).json({ user, token: user.generateJwt() });
            } else {
                // If user is not found
                res.status(401).json(info);
            }
        })(req, res);
    },

    /** Authentication method that attempts to find the specified user based on the email.
     * And then trues to authenticate the user with the passed password.
     *
     * @param {username} username User's username (email)
     * @param {string} password User's password
     * @param {Function} done Callback
     */
    authenticate(username, password, done) {
        User.findOne({ email: username })
            .then(user => {
                // Return if user not found in database
                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }
                // Return if password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Password is wrong'
                    });
                }
                // If credentials are correct, return the user object
                return done(null, user);
            })
            .catch(err => done(err));
    },

    /**
     * Saves the authenticated user's info into a session.
     *
     * @param {Object} user Authenticated user
     * @param {Function} cb Callback
     */
    serializeUser: (user, cb) => {
        cb(null, user.id);
    },

    /**
     * Finds the user in the database based on the ID stored in the session.
     *
     * @param {string} id User's id
     * @param {Function} cb Callback
     */
    deserializeUser: (id, cb) => {
        User.findById(id)
            .then(user => cb(null, user))
            .catch(err => cb(err));
    }
};
