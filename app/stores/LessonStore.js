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
     * Binds the authentication actions to event handlers.
     * Created objects used by the store.
     *
     * @public
     */
    constructor(props) {
        super(props);

        const { defaultAmount } = filterConfig.lessons.count;

        this.bindActions(LessonActions);

        this.attendees = [];
        this.groups = [];
        this.locations = [];
        this.updatable = createObject(lessonFieldNames, {});
        this.updatable.attendees = [];
        this.filters = { start: { '$gte': new Date() } };
        this.sorters = { start: 1 };
        this.config = { limit: defaultAmount };
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
        const attendeeIndex = this.attendee.indexOf(attendee);

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
     * Handler for conflicts (status 409) in the API.
     */
    onUpdateConflict() {
        toastr.error(`Lokācija norādītajā laikā ir aizņemta!`);
    }
}

export default alt.createStore(LessonStore);
