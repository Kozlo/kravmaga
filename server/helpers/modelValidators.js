/**
 * Common helpers.
 */

const { userConfig } = require('../config');
const config = require('../config');
const helpers = require('./');

module.exports = {

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
     * @param {*} password User's password.
     * @returns {boolean} Flag showing is the value is a valid password.
     */
    isPasswordValid(password) {
        return typeof password === 'string' && password.length >= userConfig.minPasswordLength;
    },

    /**
     * Checks if the passed starting date is valid.
     *
     * It must be a date and if the end date has already been defined, it must be smaller than that.
     *
     * @public
     * @param {Date} startDate Lesson starting date.
     * @returns {boolean} Flag showing is the value is a valid starting date
     */
    isStartDateValid(startDate) {
        if (!helpers.isValidDate(startDate)) return false;

        if (helpers.isValidDate(this.end)) {
            return startDate < this.end;
        }

        return true;
    },

    /**
     * Checks if the passed ending date is valid.
     *
     * It must be a date and if the start date has already been defined, it must be larger than that.
     *
     * @public
     * @param {Date} endDate Lesson starting date.
     * @returns {boolean} Flag showing is the value is a valid starting date
     */
    isEndDateValid(endDate) {
        if (!helpers.isValidDate(endDate)) return false;

        if (helpers.isValidDate(this.start)) {
            return endDate > this.start;
        }

        return true;
    },

    /**
     * Checks if the group members are valid an unique.
     *
     * Loops through the array until an invalid entry is found (if any).
     *
     * @param {string[]} members Groups members
     * @returns {boolean} Flag showing if the members are valid
     */
    areMembersValid(members) {
        const sortedMembers = members.slice().sort();

        for (var i = 0; i < sortedMembers.length - 1; i++) {
            if (typeof sortedMembers[i] !== 'string' || sortedMembers[i].trim() === '') {
                return false
            }

            if (sortedMembers[i + 1] === sortedMembers[i]) {
                return false;
            }
        }

        return true;
    }
};
