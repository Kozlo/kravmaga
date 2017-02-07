import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import GroupStore from '../../../stores/GroupStore';
import DataModal from '../../shared/DataModal';
import { getGroupMemberCount } from '../../../utils/utils';

class ManageGroup extends React.Component {
    static getStores() {
        return [GroupStore];
    }

    static getPropsFromStores() {
        return GroupStore.getState();
    }

    render() {
        const {
            shouldShow, isRequesting,
            closeHandler, submitHandler,
            updatable, members
        } = this.props;
        const { name } = updatable;
        const memberCount = getGroupMemberCount(updatable._id, members);
        const title = `Grupa ${name} (${memberCount} lietotāji)`;

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

export default connectToStores(ManageGroup);
