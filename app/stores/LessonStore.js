import alt from '../alt';
import EntryStore from './EntryStore';
import LessonActions from '../actions/LessonActions';
import { createObject } from '../utils/utils';
import { lessonFieldNames, filterConfig } from '../utils/config';

/**
 * Store for lesson-related data.
 */
class LessonStore extends EntryStore {
    /**
     * Binds store actions to event handlers.
     * Creates objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        const { defaultAmount } = filterConfig.count;

        this.bindActions(LessonActions);

        this.attendees = [];
        this.groups = [];
        this.locations = [];
        this.userList = [];
        this.updatable = createObject(lessonFieldNames, {});
        this.updatable.attendees = [];
        this.sorters = { start: 1 };
        this.config = { limit: defaultAmount };

        this.onResetFilters();
    }

    /**
     * Lesson attendees received handler.
     *
     * @public
     * @param {Object[]} attendees User objects
     */
    onAttendeesReceived(attendees) {
        this.attendees = attendees;
    }

    /**
     * Attendee added handler.
     *
     * @public
     * @param {Object} attendee User object
     */
    onAttendeeAdded(attendee) {
        this.attendees.push(attendee);
    }

    /**
     * Attendee removed handler.
     *
     * @public
     * @param {Object} attendee User object
     */
    onAttendeeRemoved(attendee) {
        const attendeeIndex = this.attendees.indexOf(attendee);

        this.attendees.splice(attendeeIndex, 1);
    }

    /**
     * Lesson groups received handler.
     *
     * @public
     * @param {Object[]} groups Group objects
     */
    onGroupsReceived(groups) {
        this.groups = groups;
    }

    /**
     * Lesson locations received handler.
     *
     * @public
     * @param {Object[]} locations Location objects
     */
    onLocationsReceived(locations) {
        this.locations = locations;
    }

    /**
     * Resets filters to an initial state.
     *
     * Clears the hours so all times are included.
     *
     * @public
     */
    onResetFilters() {
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        this.filters = { start: { '$gte': today } };
    }

    /**
     * Handler for conflicts (status 409) in the API.
     */
    onUpdateConflict() {
        toastr.error(`Lokācija norādītajā laikā ir aizņemta!`);
    }

    /**
     * All user list received handler.
     *
     * @public
     * @param {Array} userList List of all existing users.
     */
    onUserListReceived(userList) {
        this.userList = userList;
    }
}

export default alt.createStore(LessonStore);
