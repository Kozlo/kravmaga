/**
 * Methods used by operations related to groups.
 */

const helpers = require('./');

const Lesson = require('../models/lesson');

module.exports = {
    /**
     * Removes the specified user from lessons associated with the specified group.
     *
     * @public
     * @param {string} userId ID for the user being removed from a group
     * @param {string} groupId ID of the group the user is being removed from
     * @param {Function} next Executes the next matching route
     */
    removeAttendeeFromGroupLessons(userId, groupId, next) {
        const lessonFilter = { group: groupId };

        Lesson.find(lessonFilter)
            .then(lessons => {
                lessons.forEach(lesson => {
                    lesson.attendees = helpers.removeItemFromArray(userId, lesson.attendees);
                    lesson.save()
                        .catch(err => next(err));
                });
            });
    }
};