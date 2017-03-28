import React from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import PaymentTypeStore from '../../../stores/PaymentTypeStore';
import DataModal from '../../shared/DataModal';

/**
 * Manage payment type update modal container.
 */
class ManagePaymentType extends React.Component {
    static getStores() {
        return [PaymentTypeStore];
    }

    static getPropsFromStores() {
        return PaymentTypeStore.getState();
    }

    /**
     * Data modal for updating payment types.
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
        const title = `Maksājumu tips ${name}`;

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

export default connectToStores(ManagePaymentType);
