/**
 * Users controller.
 */

const config = require('../config');
const userHelpers = require('../helpers/usersHelpers');
const User = require('../models/user');

const { httpStatusCodes } = config;

module.exports = {

    /**
     * Create a user based on the passed params.
     *
     * Checks if the password is valid.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    createOne(req, res, next) {
        const error = userHelpers.passwordIsNotValid(req.body.password);

        if (error) {
            return next(error);
        }

        const user = new User(req.body);

        user.setPassword(req.body.password);
        user.save(req.body)
            .then(user => res.status(httpStatusCodes.created).send(user))
            .catch(err => {
                const userExistsError = userHelpers.userExistsError(err);

                if (userExistsError) {
                    return next(userExistsError);
                }

                next(err);
            });
    },

    /**
     * Retrieves all users based on the passed filters.
     *
     * Sorts users by the last update in a descending order by default.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getAll(req, res, next) {
        const filters = req.filters || {};
        const sorters = req.sorters || { 'updatedAt': -1 };

        User.find(filters)
            .sort(sorters)
            .then(users => res.status(httpStatusCodes.ok).send(users))
            .catch(err => next(err));
    },

    /**
     * Retrieves a single user based on the ID.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getOne(req, res, next) {
        User.findById(req.params.id)
            .then(user => res.status(httpStatusCodes.ok).send(user))
            .catch(err => next(err));

    },

    /**
     * Updated the specified user.
     *
     * Raises an error if the password is not undefined and invalid.
     * Also checks if the user is admin if admin_fields are not undefined.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    updateOne(req, res, next) {
        const passwordError = userHelpers.passwordIsNotValid(req.body.password, true);

        if (passwordError) {
            return next(passwordError);
        }

        const privilegeError = userHelpers.privilegeCheck(req.body, req.userIsAdmin, req.user._id);

        if (privilegeError) {
            return next(privilegeError);
        }

        User.findByIdAndUpdate(req.params.id, req.body, { 'new': true })
            .then(updatedUser => res.status(httpStatusCodes.ok).send(updatedUser))
            .catch(err => {
                const userExistsError = userHelpers.userExistsError(err);

                if (userExistsError) {
                    return next(userExistsError);
                }

                next(err);
            });
    },

    /**
     * Deletes the specified user.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    deleteOne(req, res, next) {
        User.findByIdAndRemove(req.params.id)
            .then(deletedUser => res.status(httpStatusCodes.ok).send(deletedUser))
            .catch(err => next(err));
    }

};
