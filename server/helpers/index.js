/**
 * Common helpers.
 */

const config = require('../config');

const { httpStatusCodes } = config;
const mongoError = 'MongoError';
const mongoDupKeyErrorCode = 11000;

module.exports = {

    /**
     * Checks if the passed string is valid.
     * Also trips the spaces from the start/end to check if the string is not empty.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is a valid string.
     */
    isValidString(val) {
        return typeof val === 'string' && val.trim() !== '';
    },

    /**
     * Checks if the passed value has type undefined.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is undefined.
     */
    isTypeUndefined(val) {
        return typeof val === 'undefined';
    },

    /**
     * Converts the argument to a date and checks if the result is a valid date.
     *
     * @public
     * @param {Date} date Date to check
     * @returns {boolean} Flag showing if the value is a valid date
     */
    isValidDate(date) {
        return date instanceof Date && date.toString() !== 'Invalid Date';
    },

    /**
     * Created an error with the specified message and name.
     *
     * @public
     * @param {string} message Error message
     * @param {number} status Error status code
     */
    createError(message, status) {
        return { message, status };
    },

    /**
     * Checks if the error is a duplicate key error.
     *
     * If this error occurs then the entry already exists.
     *
     * @param err {Object} Error
     * @returns {Object|boolean} Error or false
     */
    entryExistsError(err) {
        if (err.name === mongoError && err.code === mongoDupKeyErrorCode) {
            const message = 'Entry already exists.';

            return this.createError(message, httpStatusCodes.conflict);
        }

        return false;
    }
};
