import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import LessonStore from '../../../stores/LessonStore';
import DataModal from '../../shared/DataModal';
import { formatDateString } from '../../../utils/utils';

class ManageLesson extends React.Component {
    static getStores() {
        return [LessonStore];
    }

    static getPropsFromStores() {
        return LessonStore.getState();
    }

    render() {
        const {
            shouldShow, isRequesting,
            closeHandler, submitHandler, updatable
        } = this.props;
        const { date, attendees } = updatable;
        const formattedDate = formatDateString(date, true);
        const title = `Nodarbībai ${formattedDate} (${attendees.length} pieteikušies dalībnieki)`;

        return (
            <DataModal
                shouldShow={shouldShow}
                title={title}
                closeHandler={closeHandler}
                submitHandler={submitHandler}
                isDisabled={isRequesting}>
                {this.props.children}
            </DataModal>
        );
    }
}

export default connectToStores(ManageLesson);
