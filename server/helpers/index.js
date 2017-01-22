/**
 * Common helpers.
 */

const { userConfig } = require('../config');

// TODO: remove all unused methods
module.exports = {

    /**
     * Checks if the passed string is valid.
     * Also trips the spaces from the start/end to check if the string is not empty.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is a valid string.
     */
    isValidString(val) {
        return this.isTypeString(val) && val.trim() !== '';
    },

    /**
     * Checks if the passed values type is string.
     * This can also be used for empty strings.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is a string.
     */
    isTypeString(val) {
        return typeof val === 'string';
    },

    /**
     * Checks if the passed value is boolean or an empty string.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is boolean or an empty string.
     */
    isTypeBooleanOrEmptyString(val) {
        return this.isTypeBoolean(val) || val === '';
    },

    /**
     * Checks if the passed value is boolean is valid.
     *
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is boolean.
     */
    isTypeBoolean(val) {
        return typeof val === 'boolean';
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
     * Checks if the value is truthy, it's type is object, and it's not an array.
     * If the above is true, the argument is an object.
     *
     * @public
     * @param {*} val Value to check
     * @returns {boolean} Flag showing is the value is an object or not.
     */
    isObject(val) {
        return val !== null && typeof val === 'object' && !Array.isArray(val);
    },

    /**
     * Checks if the passed e-mail is valid.
     *
     * @public
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is a valid e-mail.
     */
    isEmailValid(val) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(val);
    },

    /**
     * Checks if the passed password is valid.
     *
     * @public
     * @param {*} val Value to check.
     * @returns {boolean} Flag showing is the value is a valid password.
     */
    isPasswordValid(password) {
        // TODO: try req.assert('password', 'Password cannot be blank').notEmpty();
        return typeof password === 'string' && password.length >= userConfig.minPasswordLength;
    },

    /**
     * Created an error with the specified message and name.
     *
     * @public
     * @param {Object} res Response object
     * @param {string} msg Error message
     * @param {number} status Status code
     */
    createError(message, name) {
        const error = new Error(message);

        error.name = name;

        return error;
    }
};
