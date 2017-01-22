/**
 * Middleware used within the app.
 */

const helpers = require('../helpers/index');
const { errorNames } = require('../config');
const User = require('../models/user');

module.exports = {
    /**
     * Checks if the user is authenticated, exists in the DB, is not blocked.
     *
     * If the authenticated use does not exist or is blocked, the no actions should be allowed.
     * Otherwise adds to thr request a flag showing if the user is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    addIsAdmin(req, res, next) {
        const authUserId = req.payload._id;

        User.findById(authUserId)
            .then(authUser => {
                if (!authUser) {
                    const message = `Authenticated user with ID ${authUserId} does not exist`;
                    const error = helpers.createError(message, errorNames.unauthorizedError);

                    return next(error);
                }

                if (authUser.admin_fields.is_blocked === true) {
                    const message = `Authenticated user with ID ${authUserId} is blocked`;
                    const error = helpers.createError(message, errorNames.forbiddenError);

                    return next(error);
                }

                req.authUserIsAdmin = authUser.admin_fields.role === 'admin';

                next();
            })
            .catch(err => next(err));
    },

    /**
     * Prevents further execution if the authenticated user is not an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    requireIsAdmin(req, res, next) {
        const authUserId = req.payload.sub;

        if (req.authUserIsAdmin !== true) {
            const message = `The requested resource can only be used by admins. Authenticated user with ID ${authUserId} id not an admin.`;
            const error = helpers.createError(message, errorNames.forbiddenError);

            return next(error);
        }

        next();
    },

    /**
     * Checks if the user is trying to get or update own profile.
     * And if not, if the user is an admin.
     *
     * If both conditions are false, then an exception is raised.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    canAccessSelfUnlessAdmin(req, res, next) {
        const authUserId = req.payload.sub;

        if (req.params.id !== authUserId && !req.authUserIsAdmin) {
            const message = `Only admin users can view other users. Authenticated use with ID ${authUserId} is not an admin.`;
            const error = helpers.createError(message, errorNames.forbiddenError);

            return next(error);
        }

        next();
    }
};