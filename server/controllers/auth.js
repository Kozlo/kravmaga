/**
 * Authentication controller.
 */

const helpers = require('../helpers/common');
const userHelpers = require('../helpers/users');
const User = require('../models/user');

module.exports = {

    /**
     * Retrieves authentication-related config stored in environmental variables.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    getConfig(req, res) {
        const jwt_audience = process.env.JWT_AUDIENCE;
        const auth0_id = process.env.AUTH0_ID;

        if (!jwt_audience) return handleError(res, null, 'JWT_AUDIENCE environmental variable not set', 500);
        if (!auth0_id) return handleError(res, null, 'AUTH0_ID environmental variable not set', 500);

        res.status(200).json({ jwt_audience, auth0_id });
    },

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
    }
};
