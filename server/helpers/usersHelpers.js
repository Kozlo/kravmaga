/**
 * Methods used by operations related to users.
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const config = require('../config');
const helpers = require('./');

const { badRequestError, forbiddenError } = config.errorNames;

module.exports = {

    //=======================================
    // User Input Validation Helpers
    //=======================================

    /**
     * Checks if the authenticated user is trying to edit admin fields that can only be edited by admin.
     *
     * @param {string|undefined} password Password
     * @param {boolean} [isOptional] Flag showing if password property is mandatory
     * @returns {boolean|Error} False or an error
     */
    privilegeCheck(adminFields, authUserIsAdmin, authUserId) {
        if (helpers.isTypeUndefined(adminFields) || authUserIsAdmin) {
            return false;
        }

        const message = `Only admin users are allowed to modify admin_fields for a user. The authenticated user with ID  ${authUserId} is not an admin.`;

        return helpers.createError(message, forbiddenError);
    },

    /**
     * Checks if the password is invalid.
     *
     * Allows the password to be undefined if it's optional.
     *
     * @param {string|undefined} password Password
     * @param {boolean} [isOptional] Flag showing if password property is mandatory
     * @returns {boolean|Error} False or an error
     */
    passwordIsNotValid(password, isOptional = false) {
        if (helpers.isPasswordValid(password)) {
            return false;
        }

        if (isOptional && helpers.isTypeUndefined(password)) {
            return false;
        }

        const constraint = isOptional ? 'optional' : 'mandatory';
        const message = `The passed ${constraint} user property password ${password} is not valid.`;

        return helpers.createError(message, config.errorNames.badRequestError);
    },

    //=======================================
    // User Model Helpers
    //=======================================

    /**
     * Sets the user's salt and hash based on the passed password string.
     *
     * @param {string} password Password
     */
    setPassword(password) {
        const passwordBuffer = new Buffer(password, 'binary');

        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(passwordBuffer, this.salt, 1000, 64, 'sha1').toString('hex');
    },

    /**
     * Converts the passed password to a hash with the user's salt and checks if it matches with the user's hash string.
     *
     * @param {string} password Password
     * @returns {boolean} Flag showing if the password is correct
     */
    validPassword(password) {
        const passwordBuffer = new Buffer(password, 'binary');

        return this.hash === crypto.pbkdf2Sync(passwordBuffer, this.salt, 1000, 64, 'sha1').toString('hex');
    },

    /**
     * Generate's a new JWT token based on the passed secret.
     *
     * @param {string} jwtSecret JWT secret
     * @returns {string} JWT token
     */
    generateJwt(jwtSecret) {
        const expiry = new Date();

        expiry.setDate(expiry.getDate() + 7);

        return jwt.sign({
            _id: this._id,
            email: this.email,
            exp: parseInt(expiry.getTime() / 1000),
        }, jwtSecret);
    }
};