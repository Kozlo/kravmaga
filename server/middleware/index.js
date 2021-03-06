/**
 * Middleware used within the app.
 */

const helpers = require('../helpers/index');
const { httpStatusCodes } = require('../config');
const User = require('../models/user');

module.exports = {
    /**
     * Checks if the user is authenticated, exists in the DB, is not blocked.
     *
     * If the authenticated user does not exist or is blocked, then no actions should be allowed.
     * Otherwise adds to the request a flag showing if the user is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    addIsAdmin(req, res, next) {
        const authUserId = req.user._id;

        User.findById(authUserId)
            .then(authUser => {
                if (!authUser) {
                    const message = `Authenticated user with ID ${authUserId} does not exist`;
                    const error = helpers.createError(message, httpStatusCodes.unauthorized);

                    return next(error);
                }

                if (authUser.admin_fields.is_blocked === true) {
                    const message = `Authenticated user with ID ${authUserId} is blocked`;
                    const error = helpers.createError(message, httpStatusCodes.forbidden);

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
        const authUserId = req.user._id;

        if (req.authUserIsAdmin !== true) {
            const message = `The requested resource can only be used by admins. Authenticated user with ID ${authUserId} is not an admin.`;
            const error = helpers.createError(message, httpStatusCodes.forbidden);

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
        const authUserId = req.user._id;

        if (req.params.id !== authUserId && !req.authUserIsAdmin) {
            const message = `Only admin users can access other users. Authenticated use with ID ${authUserId} is not an admin.`;
            const error = helpers.createError(message, httpStatusCodes.forbidden);

            return next(error);
        }

        next();
    },

    /**
     * Checks if the user is trying to add/remove own id as an attendee.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    attendanceForSelfOnly(req, res, next) {
        const authUserId = req.user._id;
        const attendeeId = req.params.attendeeId;

        if (attendeeId !== authUserId) {
            const message = `Attendance can only be marked for own user.`;
            const error = helpers.createError(message, httpStatusCodes.forbidden);

            return next(error);
        }

        next();
    }
};