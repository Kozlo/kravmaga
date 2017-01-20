/**
 * Authentication controller.
 */

const helpers = require('../helpers/index');
const userHelpers = require('../helpers/users');
const User = require('../models/user');

module.exports = {

    // TODO: remove as this is not needed anymore
    // /**
    //  * Retrieves authentication-related config stored in environmental variables.
    //  *
    //  * @public
    //  * @param {Object} req Request object.
    //  * @param {Object} res Response object
    //  */
    // getConfig(req, res) {
    //     const jwt_audience = process.env.JWT_AUDIENCE;
    //     const auth0_id = process.env.AUTH0_ID;
    //
    //     if (!jwt_audience) return handleError(res, null, 'JWT_AUDIENCE environmental variable not set', 500);
    //     if (!auth0_id) return handleError(res, null, 'AUTH0_ID environmental variable not set', 500);
    //
    //     res.status(200).json({ jwt_audience, auth0_id });
    // },

    // TODO: make this a login route
    /**
     * Checks if the user exists and returns the user if yes. Otherwise creates the user.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    checkProfile(req, res) {
        const auth_id = req.payload.sub;

        if (!userHelpers.isUserIdValid(res, auth_id)) return;

        User.findOne({ auth_id })
            .then(authUser => {
                if (authUser) return authUser;

                const profile = req.body;
                const userProps = userHelpers.createUser(res, profile);

                if (!userProps) helpers.throwError(res, 'Some of the user props for profile are not valid', 400);

                return User.create(userProps);
            })
            .then(user => {
                if (user.is_blocked !== false) {
                    res.status(403).send(`User with auth_id ${user.auth_id} is blocked`);
                } else {
                    res.status(200).send(user);
                }
            })
            .catch(err => helpers.handleError(res, err, `Error logging in user with ID ${auth_id}`));
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
