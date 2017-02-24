/**
 * Common helpers.
 */

const config = require('../config');

const { httpStatusCodes } = config;
const mongoError = 'MongoError';
const mongoDupKeyErrorCode = 11000;

module.exports = {

    /**
     * Extracts filters, sorters and config from query params.
     *
     * Instantiates them to empty objects if they are not defined.
     * Additionally parses the limit to an int if it's present or sets to 0 (i.e. get all resutls)
     *
     * @param {Object} queryParams Request query parameters.
     * @returns {Object} Query parameters
     */
    parseQueryParams(queryParams) {
        const {
            filters = {},
            sorters = {},
            config = {}
        } = queryParams;

        config.limit = config.limit ? parseInt(config.limit, 10) : 0;

        return { filters, sorters, config };
    },

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
    },

    /**
     *
     * Creates an error for a location being taken at the specified times.
     *
     * @public
     * @param {Object[]} Existing lessons
     * @returns {Object} Error
     */
    locationTakenError(existingLessons) {
        const message = `The specified location is already taken at the specified date/time: ${JSON.stringify(existingLessons)}`;

        return this.createError(message, httpStatusCodes.conflict);
    },

    /**
     * Removes the passed item from the specified array.
     *
     * @public
     * @param {*} item Item to remove
     * @param {Array} array Array to use
     * @returns {Array} Updated array
     */
    removeItemFromArray(item, array) {
        const itemIndex = array.indexOf(item);

        if (itemIndex > -1) {
            array.splice(itemIndex, 1);
        }

        return array;
    },

    /**
     * Checks if the passed value is a valid URL.
     *
     * @public
     * @param {string} url URL to check
     * @returns {boolean} Flag showing if the value is a valid URL
     */
    isUrlValid(url) {
        const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        return pattern.test(url);
    },

    /**
     * Find a list of items in the first array that are not present in the second array.
     *
     * These items represent values that have been removed as a results of the array item replacement.
     *
     * @public
     * @param {string[]} firstArray List items that used to be in the list and may contain items form the new list
     * @param {string[]} secondArray List of new items
     * @returns {string[]} List of items  IDs that should be removed
     */
    findRemovableItems(firstArray, secondArray) {
        return firstArray.filter(firstArrayItem => secondArray.indexOf(firstArrayItem) === -1);
    },

    /**
     * Find values that are present in the seconds list, but not in the first one (i.e. unique ones).
     *
     * These represent values that are new.
     *
     * @public
     * @param {string[]} firstArray List of old items
     * @param {string[]} secondArray List of new items where new unique values should be looked for
     * @returns {string[]} List of new, unique items
     */
    findAddableItems(firstArray, secondArray) {
        return secondArray.filter(secondArrayItem => firstArray.indexOf(secondArrayItem) === -1);
    }
};
