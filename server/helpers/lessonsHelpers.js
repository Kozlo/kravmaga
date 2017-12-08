/**
 * Methods used by operations related to lessons.
 */

const helpers = require('./');
const { httpStatusCodes } = require('../config');

module.exports = {
    /**
     * Checks if the lesson attendance can be updated.
     *
     * Only allows updates for lessons that have already been started.
     *
     * @private
     * @param {Object} lesson Lesson
     * @returns {Object} Lesson
     */
    checkAttendanceMarking(lesson) {
        // if the lesson has already started then the user cannot mark attendance
        if (new Date() > lesson.start) {
            throw helpers.createError('Lesson already started, cannot mark attendance', httpStatusCodes.badRequest);
        }

        return lesson;
    }
};