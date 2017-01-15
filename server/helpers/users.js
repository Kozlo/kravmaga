/**
 * Common helpers.
 */

const helpers = require('./common');

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
        return helpers.isValidString(userId) ? true : helpers.handleError(res, null, 'User ID is not valid', 401);
    },

    /**
     * Creates a new user based on the passed profile. Tries to extract usable data from the profile.
     *
     * In case some profile properties were not valid, returns undefined.
     *
     * @param {Object} res Response to use in case of errors.
     * @param {Object} profile Profile the user is using to log in.
     * @returns {User|undefined} Created user.
     */
    createUser(res, profile) {
        if (this.isUserIdValid(res, profile.user_id)) {
            return this._getValidUser(res, profile);
        } else {
            return helpers.handleError(res, null, `The passed auth_id ${profile.auth_id} is not a valid string`, 403);
        }
    },

    /**
     * Constructs an object with valid properties that can be updated or returns undefined if something was wrong.
     *
     * @public
     * @param {Object} res Response to use in case of errors.
     * @param {Object} profile Profile being updated.
     * @param {Object} authUser User who is trying to create the user.
     * @returns {Object|undefined}
     */
    updateUser(res, profile, authUser) {
        return this._getValidUser(res, profile, authUser);
    },

    /**
     * Validates all passed user properties and returns the constructed object is appropriate.
     *
     * Excludes auth_id as it
     *
     * @private
     * @param {Object} res Response to use in case of errors.
     * @param {Object} profile Profile user is using to log in or create user.
     * @param {Object} [authUser] User who is trying to create or update the user.
     * @returns {Object|undefined} Object with valid user properties if validated.
     */
    _getValidUser(res, profile, authUser) {
        if (!helpers.isObject(profile)) return helpers.handleError(res, null, 'The passed profile not a valid object', 400);

        const user = {};
        const { user_id, email, given_name, family_name, gender, picture, is_admin, is_blocked } = profile;

        if (typeof user_id !== 'undefined') {
            if (this.isUserIdValid(res, user_id) || user_id === '') {
                user.auth_id = user_id;
            } else {
                return helpers.handleError(res, null, `The passed user_id ${user_id} is not a valid string`, 400);
            }
        }
        if (typeof email !== 'undefined') {
            if (helpers.isValidEmail(email) || email === '') {
                user.email = email
            } else {
                return helpers.handleError(res, null, `The passed email ${email} is not valid`, 400);
            }
        }
        if (typeof given_name !== 'undefined') {
            if (helpers.isValidString(given_name) || given_name === '') {
                user.given_name = given_name;
            } else {
                return helpers.handleError(res, null, `The passed given_name ${given_name} is not a valid string`, 400);
            }
        }
        if (typeof family_name !== 'undefined') {
            if (helpers.isValidString(family_name) || family_name === '') {
                user.family_name = family_name;
            } else {
                return helpers.handleError(res, null, `The passed family_name ${family_name} is not a valid string`, 400);
            }
        }
        if (typeof gender !== 'undefined') {
            if (helpers.isValidString(gender) || gender === '') {
                user.gender = gender;
            } else {
                return helpers.handleError(res, null, `The passed gender ${gender} is not a valid string`, 400);
            }
        }
        if (typeof picture !== 'undefined') {
            if (helpers.isValidString(picture) || picture === '') {
                user.picture = picture;
            } else {
                return helpers.handleError(res, null, `The passed picture ${picture} is not a valid string`, 400);
            }
        }
        if (helpers.isBooleanValue(is_admin) || is_admin === '')  {
            if (authUser && authUser.is_admin === true) {
                user.is_admin = is_admin;
            } else {
                return helpers.handleError(res, null, 'Only admin users are allowed to change the role for other users', 403);
            }
        }
        if (helpers.isBooleanValue(is_blocked) || is_blocked === '')  {
            if (authUser && authUser.is_admin === true) {
                user.is_blocked = is_blocked;
            } else {
                return helpers.handleError(res, null, 'Only admin users are allowed to block/unblock other users', 403);
            }
        }

        return user;
    }

};
