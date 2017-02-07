import alt from '../alt';
import EntryActions from './EntryActions';
import { lessonFieldNames, generalConfig } from '../utils/config';
import { httpStatusCode, createObject, encodeJsonUrl } from '../utils/utils';

class LessonActions extends EntryActions {
    constructor(props) {
        super(props);

        this.generateActions(
            'attendeesReceived',
            'attendeeAdded',
            'attendeeRemoved',
            'groupsReceived',
        );

        this.url = generalConfig.api.lessonUrl;
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
}

export default alt.createActions(LessonActions);
