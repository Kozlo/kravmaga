/**
 * Groups controller.
 */

const config = require('../config');
const helpers = require('../helpers');
const groupsHelpers = require('../helpers/groupsHelpers');

const Group = require('../models/group');
const Lesson = require('../models/lesson');

const { httpStatusCodes } = config;

module.exports = {

    /**
     * Create an entry based on the passed params.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    createOne(req, res, next) {
        const entryProps = req.body;

        Group.create(entryProps)
            .then(entry => res.status(httpStatusCodes.created).send(entry))
            .catch(err => {
                const entryExistsError = helpers.entryExistsError(err);

                if (entryExistsError) return next(entryExistsError);

                next(err);
            });
    },

    /**
     * Retrieves all entries.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getAll(req, res, next) {
        const { filters, sorters, config } = helpers.parseQueryParams(req.query);
        const { limit } = config;

        Group.find(filters)
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

        Group.findById(entryId)
            .then(entry => res.status(httpStatusCodes.ok).send(entry))
            .catch(err => next(err));

    },

    /**
     * Updates the specified entry.
     *
     * Sets the members property to an empty array if it's defined, but not valid.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    updateOne(req, res, next) {
        const entryId = req.params.id;
        const entryProps = req.body;
        const opts = { 'new': true, runValidators: true };

        if (typeof entryProps.members !== 'undefined' && !entryProps.members) {
            entryProps.members = []
        }

        Group.findByIdAndUpdate(entryId, entryProps, opts)
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => {
                const entryExistsError = helpers.entryExistsError(err);

                if (entryExistsError) {
                    return next(entryExistsError);
                }

                next(err);
            });
    },

    /**
     * Deletes the specified entry.
     *
     * Also deletes all lessons for this group.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    deleteOne(req, res, next) {
        const entryId = req.params.id;
        const lessonFilter = { group: entryId };

        Lesson.find(lessonFilter)
            .remove()
            .then(() => Group.findByIdAndRemove(entryId))
            .then(deletedEntry => res.status(httpStatusCodes.ok).send(deletedEntry))
            .catch(err => next(err));
    },

    /**
     * Retrieves a list of groups for a user.
     *
     * The groups are determined by user id.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getUserGroups(req, res, next) {
        const userId = req.params.id;
        const groupFilter = { members: userId };

        Group.find(groupFilter)
            .then(entries => res.status(httpStatusCodes.ok).send(entries))
            .catch(err => next(err));
    },

    /**
     * Adds a user to all of the specified groups.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    addUserToGroups(req, res, next) {
        const userId = req.params.id;
        const groupIds = req.body.groupIds;

        if (!Array.isArray(groupIds) || groupIds.length === 0) {
            return res.status(httpStatusCodes.ok).send('Nothing to add.');
        }

        groupIds.forEach((groupId, index, array) => {
            Group.findById(groupId)
                .then(entry => {
                    if (entry.members.indexOf(userId) === -1) {
                        entry.members.push(userId);
                    }

                    return entry.save();
                })
                .then(() => {
                    const isLastEntry = index === (array.length - 1);

                    if (isLastEntry) {
                        res.status(httpStatusCodes.ok).send('User added to all groups specified');
                    }
                })
                .catch(err => next(err));
        });
    },

    /**
     * Removes the specified user from all of the specified groups.
     *
     * Additionally, removes the attendance for the user to all of the specified lessons.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    removeUserFromGroups(req, res, next) {
        const userId = req.params.id;
        const groupIds = req.body.groupIds;

        if (!Array.isArray(groupIds) || groupIds.length === 0) {
            return res.status(httpStatusCodes.ok).send('Nothing to add.');
        }

        groupIds.forEach((groupId, index, array) => {
            Group.findById(groupId)
                .then(group => {
                    if (group.members.indexOf(userId) !== -1) {
                        groupsHelpers.removeAttendeeFromGroupLessons(userId, groupId, next);
                        group.members = helpers.removeItemFromArray(userId, group.members);
                    }

                    return group.save();
                })
                .then(() => {
                    const isLastGroup = index === (array.length - 1);

                    if (isLastGroup) {
                        res.status(httpStatusCodes.ok).send('User removed from all groups specified, and lessons for the groups');
                    }
                })
                .catch(err => next(err));
        });
    }
};
