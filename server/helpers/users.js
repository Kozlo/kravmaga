/**
 * Common helpers.
 */

const User = require('../models/user');
const helpers = require('./common');
const config = require('../config');

// TODO: consider moving these to config
const optStringPropNames = ['given_name', 'family_name', 'gender', 'picture'];
const optBoolProps = ['is_admin', 'is_blocked'];

module.exports = {

    /**
     * Determines if the passed user_id is valid. Raises an error if not.
     *
     * @public
     * @param {Object} res Response object
     * @param {string} userId User id
     * @returns {boolean|undefined} Flag showing if the user id if valid or undefined if not
     */
    isUserIdValid(res, userId) {
        if (!helpers.isValidString(userId)) {
            const errorMessage = 'User ID is not valid';

            return helpers.throwError(res, errorMessage, 401);
        }

        return true;
    },

    confirmUserIsValidAdmin(res, authUser, authUserId) {
        if (!this.confirmUserExists(res, authUser, authUserId)) return false;
        if (!this.confirmUserIsAdmin(res, authUser)) return false;
        if (!this.confirmUserIsNotBlocked(res, authUser)) return false;

        return true;
    },

    confirmUserExists(res, user, userId) {
        if (!user) {
            const errorMessage = `User with ID ${userId} not found`;

            return helpers.throwError(res, errorMessage, 404);
        }

        return true;
    },

    confirmUserIsAdmin(res, user) {
        if (user.is_admin !== true) {
            const errorMessage = `User with ID ${user._id} is not an admin`;

            return helpers.throwError(res, errorMessage, 403);
        }

        return true;
    },

    confirmUserIsNotBlocked(res, user) {
        if (user.is_blocked !== false) {
            const errorMessage = `User with auth_id ${user._id} is blocked`;

            return helpers.throwError(res, errorMessage, 403);
        }

        return true;
    },

    confirmUserHasRights(res, user, id) {
        const userViewingOwnProfile = user._id.equals(id);
        const userIsAdmin = user.is_admin === true;

        if (!userViewingOwnProfile && !userIsAdmin) {
            const errorMessage = `Only admins can CRUD other users. User with ID ${user._id} is not an admin`;

            return helpers.throwError(res, errorMessage, 403);
        }

        return true;
    },

    confirmUserDoesNotExist(res, user) {
        if (user) {
            const errorMessage = `User with email ${user.email} already exists. ID: ${user._id}`;

            return helpers.throwError(res, errorMessage, 409);
        }

        return false;
    },

    /**
     * Validates all passed user properties and returns the constructed object if appropriate.
     *
     * @public
     * @param {Object} res Response to use in case of errors.
     * @param {Object} props Properties for the new user.
     * @returns {Object|undefined} Object with valid user properties if validated.
     */
    createUser(res, props) {
        if (this._validatePropsObject) return;

        const user = new User();
        const { email, password } = props;

        // validate mandatory properties
        if (!this._validateEmail(res, email, user)) return;
        if (!this._validatePassword(res, password, user)) return;

        // validate optional properties
        const { strings, boolean } = config.user.propertyNames.optional;

        if (!this._validateProps(res, strings, user, this._validateOptionalBoolProp)) return;
        if (!this._validateProps(res, boolean, user, this._validateOptionalStringProp)) return;

        return user;
    },

    _validatePropsObject() {
        if (!helpers.isObject(props)) {
            const errorMessage = 'Properties must be passed as a valid object';

            return helpers.throwError(res, errorMessage, 400);
        }

        return true;
    },

    _validateEmail(res, email, user) {
        if (!helpers.isValidEmail(email)) {
            const errorMessage = `The passed email ${email} is not valid`;

            return helpers.throwError(res, errorMessage, 400);
        }

        user.email = email;

        return true;
    },

    _validatePassword(res, password, user) {
        if (!helpers.isValidPassword(password)) {
            const errorMessage = `The passed password ${password} is not valid`;

            return helpers.throwError(res, errorMessage, 400);
        }

        user.setPassword(password);

        return true;
    },

    _validateProps(res, props, user, validator) {
        for (let i = 0; i < props.length; i++) {
            const name = props[i];
            const result = validator(res, name, props, user);

            if (!result) return false;
        }

        return true;
    },

    _validateOptionalStringProp(res, name, props, user) {
        const value = props[name];

        if (typeof value === 'undefined') {
            return true;
        }

        if (!helpers.isTypeString(value)) {
            const errorMessage = `The passed user optional string property ${name} value ${value} is not valid`;

            return helpers.throwError(res, errorMessage, 400);
        }

        user[name] = value;

        return true;
    },

    _validateOptionalBoolProp(res, name, props, user) {
        const value = props[name];

        if (typeof value === 'undefined') {
            return true;
        }

        if (helpers.isTypeBooleanOrEmptyString(value)) {
            user[name] = value;

            return true;
        }

        const errorMessage = `The passed user optional boolean property ${name} with value ${value} is not valid`;

        return helpers.throwError(res, errorMessage, 400);
    }
};
