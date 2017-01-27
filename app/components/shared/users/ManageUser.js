import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import UserStore from '../../../stores/UserStore';
import DataModal from '../DataModal';

class ManageUser extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    render() {
        const {
            shouldShow,
            updatable,
            closeHandler,
            submitHandler,
            isRequesting,
        } = this.props;
        const { given_name, family_name } = updatable;
        const title = `Lietotājs: ${given_name} ${family_name}`;

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

export default connectToStores(ManageUser);
