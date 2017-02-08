/**
 * Lessons controller.
 */

const config = require('../config');
const helpers = require('../helpers');
const Lesson = require('../models/lesson');
const Group = require('../models/group');

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

        Lesson.create(entryProps)
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
        const filters = req.query.filters || {};
        const sorters = req.query.sorters || { 'updatedAt': -1 };

        Lesson.find(filters)
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
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    updateOne(req, res, next) {
        const entryId = req.params.id;
        const entryProps = req.body;

        if (typeof entryProps.attendees !== 'undefined' && !entryProps.attendees) {
            entryProps.attendees = [];
        }

        Lesson.findByIdAndUpdate(entryId, entryProps, { 'new': true })
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
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    markAttending(req, res, next) {
        const entryId = req.params.id;
        const attendeeId = req.params.attendeeId;

        Lesson.findById(entryId)
            .then(entry => {
                entry.attendees.push(attendeeId);

                return entry.save();
            })
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => next(err));
    },

    /**
     * Removes an attendee from a lesson's attendance list.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    removeAttending(req, res, next) {
        const entryId = req.params.id;
        const attendeeId = req.params.attendeeId;

        Lesson.findById(entryId)
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
        const sorters = req.query.sorters || { 'updatedAt': -1 };
        const userId = req.params.id;
        const groupFilter = { members: userId };

        Group.find(groupFilter)
            .then(groups => {
                const groupIds = groups.map(group => group._id);
                const lessonFilter = { group: { $in: groupIds } };

                return Lesson.find(lessonFilter).sort(sorters);
            })
            .then(entries => res.status(httpStatusCodes.ok).send(entries))
            .catch(err => next(err));
    }
};
