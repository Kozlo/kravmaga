import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import UserStore from '../../../stores/UserStore';
import DataModal from '../DataModal';

/**
 * Re-usable component for creating/updating a user.
 *
 * For updating this is used by regular users with regular fields only.
 * Admins pass both regular and admin fields as children.
 */
class ManageUser extends React.Component {
    static getStores() {
        return [UserStore];
    }

    static getPropsFromStores() {
        return UserStore.getState();
    }

    /**
     * Renders a Bootstrap Modal with a title.
     *
     * Binds the passed close and submit handlers.
     *
     * @public
     * @returns {string} HTML markup for the component
     */
    render() {
        const {
            shouldShow, isRequesting,
            closeHandler, submitHandler,
            updatable
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
