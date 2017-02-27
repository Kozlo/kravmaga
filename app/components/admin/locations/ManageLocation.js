import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import LocationStore from '../../../stores/LocationStore';
import DataModal from '../../shared/DataModal';

/**
 * Manage location update modal container.
 */
class ManageLocation extends React.Component {
    static getStores() {
        return [LocationStore];
    }

    static getPropsFromStores() {
        return LocationStore.getState();
    }

    /**
     * Data modal for updating locations.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const {
            shouldShow, isRequesting,
            closeHandler, submitHandler,
            updatable
        } = this.props;
        const { name } = updatable;
        const title = `Lokācija ${name}`;

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

export default connectToStores(ManageLocation);
