/**
 * Common helpers.
 */

const config = require('../config');

// TODO: put all error messages in one place
module.exports = {

    /**
     * Checks if the passed string is valid.
     * Also trips the spaces from the start/end.
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
    isValidEmail(val) {
        // TODO: try req.sanitize('email').normalizeEmail({ remove_dots: false });
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
    isValidPassword(password) {
        // TODO: try req.assert('password', 'Password cannot be blank').notEmpty();
        return typeof password === 'string' && password.length >= config.minPasswordLength;
    },

    /**
     * Calls the error handler and throws a new error.
     *
     * @public
     * @param {Object} res Response object
     * @param {string} msg Error message
     * @param {number} status Status code
     */
    throwError(res, msg, status) {
        this.handleError(res, null, msg, status);
        throw new Error(msg);
    },

    /**
     * Error handler logs the error and the message (if any) to the server and sends a response with the appropriate status code.
     *
     * Checks if the headers have already been sent before sending the response to avoid an error.
     *
     * @public
     * @param {Object} res Response object
     * @param {Object} error Error object
     * @param {string} [message] Error message
     * @param {number} [status] Status code
     */
    handleError(res, error, message = 'Internal server error', status = 500) {
        const fullError = { error, message};

        console.error(fullError);

        // TODO: test of generic mongoose errors contain status codes and add that is possible

        if (!res.headersSent) res.status(status).send(fullError);
    }

};
