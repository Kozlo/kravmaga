import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import LessonStore from '../../../stores/LessonStore';
import DataModal from '../../shared/DataModal';

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
            closeHandler, submitHandler,
            updatable, members
        } = this.props;
        const { date, attendees } = updatable;
        const title = `Nodarbība ${date} (${attendees.length} pieteikušies dalībnieki)`;

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
