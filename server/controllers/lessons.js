/**
 * Lessons controller.
 */

const config = require('../config');
const helpers = require('../helpers');
const lessonHelpers = require('../helpers/lessonsHelpers');
const userHelpers = require('../helpers/usersHelpers');
const Lesson = require('../models/lesson');
const Group = require('../models/group');
const User = require('../models/user');

const { httpStatusCodes } = config;

module.exports = {

    /**
     * Create an entry based on the passed params.
     *
     * Checks if the location is already taken at the specified times by finding entries with the following filters:
     * - location equals the passed one
     * - new lesson start/end times:
     *   - START time is LESS than the existing lesson's END time
     *   - END time is GREATER than the existing lesson's START time
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    createOne(req, res, next) {
        const entryProps = req.body;
        const { start, end, location } = entryProps;
        const locationCheckFilter = {
            location,
            start : { $lt: end },
            end : { $gt: start }
        };

        Lesson.find(locationCheckFilter)
            .then(entries => {
                if (entries.length > 0) {
                    throw helpers.locationTakenError(entries);
                }

                return Lesson.create(entryProps);
            })
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
     * By default sorts the entries by starting date.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getAll(req, res, next) {
        const { filters, sorters, config } = helpers.parseQueryParams(req.query);
        const { limit } = config;

        Lesson.find(filters)
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

        Lesson.findById(entryId)
            .then(entry => res.status(httpStatusCodes.ok).send(entry))
            .catch(err => next(err));
    },

    /**
     * Updates the specified entry.
     *
     * Checks if the location is already taken at the specified times by finding entries with the following filters:
     * - location equals the passed one
     * - new lesson start/end times:
     *   - START time is LESS than the existing lesson's END time
     *   - END time is GREATER than the existing lesson's START time
     * If the location is taken, makes sure that the location taken is not taken by the same entry.
     *
     * Uses an empty attendees array if it has been passed, but it's not valid.
     * Additionally removes all attendees if the group has changed.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    updateOne(req, res, next) {
        const entryId = req.params.id;
        const entryProps = req.body;
        const { start, end, location } = entryProps;
        const locationCheckFilter = {
            location,
            start : { $lt: end },
            end : { $gt: start }
        };
        const opts = { 'new': true, runValidators: true };

        if (typeof entryProps.attendees !== 'undefined' && !entryProps.attendees) {
            entryProps.attendees = [];
        }

        Lesson.find(locationCheckFilter)
            .then(entries => {
                if (entries.length > 0) {
                    // if there is only 1 entry and it's the one being updated, then there's the location is fine
                    if (!(entries.length === 1 && entries[0]._id.toString() === entryId)) {
                        throw helpers.locationTakenError(entries);
                    }
                }

                return Lesson.findById(entryId);
            })
            .then(entry => {
                if (entry.group !== entryProps.group) {
                    entryProps.attendees = [];
                }

                return Lesson.findByIdAndUpdate(entryId, entryProps, opts);
            })
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => {
                const entryExistsError = helpers.entryExistsError(err);

                if (entryExistsError) return next(entryExistsError);

                next(err);
            });
    },

    /**
     * Deletes the specified entry.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    deleteOne(req, res, next) {
        const entryId = req.params.id;

        Lesson.findByIdAndRemove(entryId)
            .then(deletedEntry => res.status(httpStatusCodes.ok).send(deletedEntry))
            .catch(err => next(err));
    },

    /**
     * Adds an attendee to a lesson's attendance list.
     *
     * Also updates the attendance count of the user.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    markAttending(req, res, next) {
        const entryId = req.params.id;
        const attendeeId = req.params.attendeeId;

        User.findById(attendeeId)
            .then(user => userHelpers.updateAttendance(user, 1))
            .then(() => Lesson.findById(entryId))
            .then(entry => lessonHelpers.checkAttendanceMarking(entry))
            .then(entry => {
                const isNotAttending = entry.attendees.indexOf(attendeeId) === -1;

                if (isNotAttending) {
                    entry.attendees.push(attendeeId);
                }

                return entry.save();
            })
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => next(err));
    },

    /**
     * Removes an attendee from a lesson's attendance list.
     *
     * Also updates the attendance count of the user.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    removeAttending(req, res, next) {
        const entryId = req.params.id;
        const attendeeId = req.params.attendeeId;

        User.findById(attendeeId)
            .then(user => userHelpers.updateAttendance(user, -1))
            .then(() => Lesson.findById(entryId))
            .then(entry => lessonHelpers.checkAttendanceMarking(entry))
            .then(entry => {
                const attendeeIndex = entry.attendees.indexOf(attendeeId);

                if (attendeeIndex > -1) {
                    entry.attendees.splice(attendeeIndex, 1);
                }

                return entry.save();
            })
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => next(err));
    },

    /**
     * Retrieves a list of lessons for a user.
     *
     * The lessons are determined by which groups a user belongs to.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    getUserLessons(req, res, next) {
        const { filters, sorters, config } = helpers.parseQueryParams(req.query);
        const { limit } = config;

        const userId = req.params.id;
        const groupFilter = { members: userId };

        Group.find(groupFilter)
            .then(groups => {
                const groupIds = groups.map(group => group._id);

                filters.group = { $in: groupIds };

                return Lesson
                    .find(filters)
                    .sort(sorters)
                    .limit(limit);
            })
            .then(entries => res.status(httpStatusCodes.ok).send(entries))
            .catch(err => next(err));
    }
};
