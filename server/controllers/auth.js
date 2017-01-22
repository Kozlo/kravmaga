/**
 * Authentication controller.
 */

const config = require('../config');
const passport = require('passport');
const User = require('../models/user');


const { httpStatusCodes } = config;
const jwtSecret = process.env.JWT_SECRET;

module.exports = {

    /**
     * Attempts to login the user using the local authentication strategy.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);

            if (user) {
                const token = user.generateJwt(jwtSecret);

                res.status(httpStatusCodes.ok).json({ user, token });
            } else {
                res.status(httpStatusCodes.unauthorized).json(info);
            }
        })(req, res);
    },

    /**
     * Attempts to find the specified user based on the email.
     * And then trues to authenticate the user with the passed password.
     *
     * @param {string} username User's username (email)
     * @param {string} password User's password
     * @param {Function} done Callback
     */
    authenticate(username, password, done) {
        User.findOne({ email: username })
            .then(user => {
                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }

                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Password is wrong'
                    });
                }

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
    serializeUser(user, cb) {
        cb(null, user.id);
    },

    /**
     * Finds the user in the database based on the ID stored in the session.
     *
     * @param {string} id User's id
     * @param {Function} cb Callback
     */
    deserializeUser(id, cb)  {
        User.findById(id)
            .then(user => cb(null, user))
            .catch(err => cb(err));
    }
};
