/**
 * Payments controller.
 */

const config = require('../config');
const helpers = require('../helpers');

const Payment = require('../models/payment');

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

        Payment.create(entryProps)
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

        Payment.find(filters)
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

        Payment.findById(entryId)
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

        Payment.findByIdAndUpdate(entryId, entryProps, opts)
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
     * @public
     * @param {Object} req Request object
     * @param {Object} res Response object
     * @param {Function} next Method for further execution
     */
    deleteOne(req, res, next) {
        const entryId = req.params.id;

        Payment.findByIdAndRemove(entryId)
            .then(deletedEntry => res.status(httpStatusCodes.ok).send(deletedEntry))
            .catch(err => next(err));
    }
};
