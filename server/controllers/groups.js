/**
 * Groups controller.
 */

const config = require('../config');
const helpers = require('../helpers');
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
     * Adds a member to the specified group.
     *
     * Checks if the user already is a member before adding.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    addMember(req, res, next) {
        const entryId = req.params.id;
        const memberId = req.params.memberId;

        Group.findById(entryId)
            .then(entry => {
                if (entry.members.indexOf(memberId) < 0) {
                    entry.members.push(memberId);
                }

                return entry.save();
            })
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => next(err));
    },

    /**
     * Removes a member from a group.
     *
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Executes the next matching route
     */
    removeMember(req, res, next) {
        const entryId = req.params.id;
        const memberId = req.params.memberId;

        Group.findById(entryId)
            .then(entry => {
                entry.members = helpers.removeItemFromArray(memberId, members);

                return entry.save();
            })
            .then(updatedEntry => res.status(httpStatusCodes.ok).send(updatedEntry))
            .catch(err => next(err));
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

        Group.findByIdAndRemove(entryId)
            .then(deletedEntry => res.status(httpStatusCodes.ok).send(deletedEntry))
            .catch(err => next(err));
    }
};
