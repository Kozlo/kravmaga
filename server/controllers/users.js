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
     * Checks if the password is valid. If no password is passed, sets it as the email.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    createOne(req, res, next) {
        const userProps = req.body;
        let { password, email } = req.body;

        if (typeof password === 'undefined') {
            password = email;
        }

        const error = userHelpers.passwordIsNotValid(password);

        if (error) {
            return next(error);
        }

        const user = new User(userProps);

        user.setPassword(password);
        user.save()
            .then(user => res.status(httpStatusCodes.created).send(user))
            .catch(err => {
                const userExistsError = userHelpers.userExistsError(err);

                if (userExistsError) return next(userExistsError);

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
        const userId = req.params.id;

        User.findById(userId)
            .then(user => res.status(httpStatusCodes.ok).send(user))
            .catch(err => next(err));

    },

    /**
     * Updated the specified user.
     *
     * If password is passed, checks if it's valid and updates it.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    updateOne(req, res, next) {
        const userProps = req.body;
        const userId = req.params.id;
        const authUserId = req.user._id;
        const { password } = userProps;
        const passwordError = userHelpers.passwordIsNotValid(password, true);

        if (passwordError) {
            return next(passwordError);
        }

        const privilegeError = userHelpers.privilegeCheck(userProps, userProps.userIsAdmin, authUserId);

        if (privilegeError) {
            return next(privilegeError);
        }

        User.findByIdAndUpdate(userId, userProps, { 'new': true })
            .then(updatedUser => {
                if (typeof password !== 'undefined') {
                    updatedUser.setPassword(password);

                    return updatedUser.save();
                } else {
                    res.status(httpStatusCodes.ok).send(updatedUser)
                }
            })
            .then(updatedUser => res.status(httpStatusCodes.ok).send(updatedUser))
            .catch(err => {
                const userExistsError = userHelpers.userExistsError(err);

                if (userExistsError) return next(userExistsError);

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
        const userId = req.params.id;

        User.findByIdAndRemove(userId)
            .then(deletedUser => res.status(httpStatusCodes.ok).send(deletedUser))
            .catch(err => next(err));
    }

};
