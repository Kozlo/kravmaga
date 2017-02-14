import alt from '../alt';
import EntryStore from './EntryStore';
import LessonActions from '../actions/LessonActions';
import { createObject } from '../utils/utils';
import { lessonFieldNames, filterConfig } from '../utils/config';

class LessonStore extends EntryStore {
    constructor(props) {
        super(props);

        const { defaultAmount } = filterConfig.lessons.count;

        this.bindActions(LessonActions);

        this.attendees = [];
        this.groups = [];
        this.updatable = createObject(lessonFieldNames, {});
        this.updatable.attendees = [];
        this.filters = { start: { '$gte': new Date() } };
        this.limit = defaultAmount;
    }

    onAttendeesReceived(attendees) {
        this.attendees = attendees;
    }

    onAttendeeAdded(attendee) {
        this.attendees.push(attendee);
    }

    onAttendeeRemoved(attendee) {
        const attendeeIndex = this.attendee.indexOf(attendee);

        this.attendees.splice(attendeeIndex, 1);
    }

    onGroupsReceived(groups) {
        this.groups = groups;
    }
}

export default alt.createStore(LessonStore);
