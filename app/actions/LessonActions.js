import alt from '../alt';

import EntryActions from './EntryActions';

import { lessonFieldNames, generalConfig } from '../utils/config';
import { httpStatusCode, createObject } from '../utils/utils';

class LessonActions extends EntryActions {
    constructor(props) {
        const { baseUrl, userLessonUrl, attendanceUrls } = generalConfig.api.lessons;

        super(props);

        this.generateActions(
            'attendeesReceived',
            'attendeeAdded',
            'attendeeRemoved',
            'groupsReceived',
        );

        this.url = baseUrl;
        this.userLessonUrl = userLessonUrl;
        this.attendanceUrls = attendanceUrls;
    }

    /**
     * Retrieved lessons for the specified user.
     *
     * The method relies on jQuery to append the data to the GET request as encoded URI string.
     *
     * @param {string} token Auth token
     * @param {string} userId User id
     * @param {Object} filters User lesson filters
     * @param {number} limit User lesson limit per request
     * @param {Function} [successHandler] Success handler
     * @returns {Promise} Request promise
     */
    getUserLessonList(token, userId, filters, limit, successHandler = this.listReceived) {
        const statusCode = $.extend({ 200: entries => successHandler(entries)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}${this.userLessonUrl}/${userId}`,
            method: 'GET',
            data: {
                filters: filters,
                limit: limit
            }
        };

        return this._sendRequest(requestProps, token);

    }

    /**
     * Creates and sets a new updatable based on the passed entry's properties.
     *
     * @param {Object} entry Entry to take the properties from
     * @returns {Promise}
     */
    clearUpdatable(entry) {
        const updatable = createObject(lessonFieldNames, entry);

        if (Array.isArray(entry.attendees)) {
            updatable.attendees = entry.attendees.slice();
        } else {
            updatable.attendees = [];
        }

        return this.setUpdatable(updatable);
    }

    /**
     * Indicates that the user will attend the lesson.
     *
     * @param {string} token Auth token
     * @param {string} lessonId Lesson id
     * @param {string} attendeeId User id
     * @returns {Promise} Request promise
     */
    markAttending(token, lessonId, attendeeId) {
        const { mark } = this.attendanceUrls;

        return this._updateAttendance(token, lessonId, attendeeId, mark)
    }

    /**
     * Indicates that the user will not be able to attend the lesson.
     *
     * @param {string} token Auth token
     * @param {string} lessonId Lesson id
     * @param {string} attendeeId User id
     * @returns {Promise} Request promise
     */
    removeAttending(token, lessonId, attendeeId) {
        const { remove } = this.attendanceUrls;

        return this._updateAttendance(token, lessonId, attendeeId, remove)
    }

    /**
     * Sends a request for updating lesson attendance.
     *
     * @param {string} token Auth token
     * @param {string} lessonId Lesson id
     * @param {string} attendeeId User id
     * @param {string} attendanceUrl Url for marking or removing attendance
     * @returns {Promise} Request promise
     */
    _updateAttendance(token, lessonId, attendeeId, attendanceUrl) {
        const statusCode = $.extend({ 200: entry => this.updated(entry)}, httpStatusCode);
        const requestProps = {
            statusCode,
            url: `${this.url}/${lessonId}${attendanceUrl}/${attendeeId}`,
            method: 'PATCH',
        };

        return this._sendRequest(requestProps, token);
    }
}

export default alt.createActions(LessonActions);
