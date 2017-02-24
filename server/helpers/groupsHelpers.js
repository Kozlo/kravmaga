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
    },

    /**
     * Finds IDs of users who have been removed from the members list by comparing the old one and the new one.
     *
     * If any of the existing member IDs is not in the list of the new ones, it should be removed.
     *
     * @public
     * @param {string[]} currentMemberIds List of IDs of all members the groups currently has
     * @param {string[]} newMemberIds List of IDs of all members the group should have
     * @returns {string[]} List of member IDs that should be removed
     */
    findRemovableMemberIds(currentMemberIds, newMemberIds) {
        return helpers.findRemovableItems(currentMemberIds, newMemberIds);
    },

    /**
     * Finds group IDs of groups the user should be added to.
     *
     * If any of the new group IDs is not in the list of the existing ones, it should be added.
     *
     * @public
     * @param {string[]} currentMemberIds List of IDs of all groups the user is currently in
     * @param {string[]} newMemberIds List of IDs of all groups the user should now be in
     * @returns {string[]} List of group IDs that the user should be removed from
     */
    findAddableMemberIds(currentMemberIds, newMemberIds) {
        return helpers.findAddableItems(currentMemberIds, newMemberIds);
    }
};