import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import PaymentStore from '../../../stores/PaymentStore';
import DataModal from '../../shared/DataModal';

/**
 * Manage payment update modal container.
 */
class ManagePayment extends React.Component {
    static getStores() {
        return [PaymentStore];
    }

    static getPropsFromStores() {
        return PaymentStore.getState();
    }

    /**
     * Data modal for updating payment.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const {
            shouldShow, isRequesting,
            closeHandler, submitHandler
        } = this.props;
        const title = 'Maksājums';

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

export default connectToStores(ManagePayment);
