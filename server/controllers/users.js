/**
 * Users controller.
 */

const mongoose = require('mongoose');

const config = require('../config');
const helpers = require('../helpers');
const userHelpers = require('../helpers/usersHelpers');

const User = require('../models/user');
const Lesson = require('../models/lesson');
const Group = require('../models/group');

const { httpStatusCodes } = config;

module.exports = {

    /**
     * Create an entry based on the passed params.
     *
     * Checks if the password is valid. If no password is passed, sets it as the email.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    createOne(req, res, next) {
        const entryProps = req.body;
        let { password, email } = entryProps;

        if (typeof password === 'undefined') {
            password = email;
        }

        const error = userHelpers.passwordIsNotValid(password);

        if (error) {
            return next(error);
        }

        const entry = new User(entryProps);

        entry.setPassword(password);
        entry.save()
            .then(entry => res.status(httpStatusCodes.created).send(entry))
            .catch(err => {
                const entryExistsError = helpers.entryExistsError(err);

                if (entryExistsError) return next(entryExistsError);

                next(err);
            });
    },

    /**
     * Retrieves all entries based on the passed filters.
     *
     * Sorts entries by the last update in a descending order by default.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getAll(req, res, next) {
        const { filters, sorters, config } = helpers.parseQueryParams(req.query);
        const { limit } = config;

        User.find(filters)
            .sort(sorters)
            .limit(limit)
            .then(entries => res.status(httpStatusCodes.ok).send(entries))
            .catch(err => next(err));
    },

    /**
     * Retrieves a single entry based on the ID.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getOne(req, res, next) {
        const entryId = req.params.id;

        User.findById(entryId)
            .then(entry => res.status(httpStatusCodes.ok).send(entry))
            .catch(err => next(err));

    },

    /**
     * Updates the specified entry.
     *
     * If password is passed, checks if it's valid and updates it.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    updateOne(req, res, next) {
        const entryProps = req.body;
        const entryId = req.params.id;
        const authUserId = req.user._id;
        const { authUserIsAdmin } = req;
        const { password } = entryProps;
        const passwordError = userHelpers.passwordIsNotValid(password, true);

        if (passwordError) {
            return next(passwordError);
        }

        const privilegeError = userHelpers.privilegeCheck(entryProps, authUserIsAdmin, authUserId);

        if (privilegeError) {
            return next(privilegeError);
        }

        const opts = { 'new': true, runValidators: true };

        User.findByIdAndUpdate(entryId, entryProps, opts)
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
                const entryExistsError = helpers.entryExistsError(err);

                if (entryExistsError) return next(entryExistsError);

                next(err);
            });
    },

    /**
     * Deletes the specified entry.
     *
     * Removes the user from all groups.
     * Removes the user from all
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    deleteOne(req, res, next) {
        const entryId = req.params.id;
        const lessonFilter = { attendees: entryId };
        const groupFilter = { members: entryId };

        Lesson.find(lessonFilter)
            .then(lessons => {
                lessons.forEach(lesson => {
                    lesson.attendees = helpers.removeItemFromArray(entryId, lesson.attendees);
                    lesson.save().catch(err => next(err));
                });

                return Group.find(groupFilter)
            })
            .then(groups => {
                groups.forEach(group => {
                    group.members = helpers.removeItemFromArray(entryId, group.members);
                    group.save().catch(err => next(err));
                });

                return User.findByIdAndRemove(entryId)
            })
            .then(deletedUser => res.status(httpStatusCodes.ok).send(deletedUser))
            .catch(err => next(err));
    }

};
