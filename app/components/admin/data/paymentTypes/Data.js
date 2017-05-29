// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../../stores/AuthStore';
import PaymentTypeStore from '../../../../stores/PaymentTypeStore';
import PaymentTypeActions from '../../../../actions/PaymentTypeActions';

// components
import PaymentEntry from './Entry';
import ManagePaymentType from './ManagePaymentType';
import PaymentTypeFields from './PaymentTypeFields';

/**
 * Payment type data presentation component.
 *
 * Payment type data is just just plain text data without any relations.
 */
class PaymentTypeData extends React.Component {
    static getStores() {
        return [PaymentTypeStore];
    }

    static getPropsFromStores() {
        return PaymentTypeStore.getState();
    }

    /**
     * Retrieves payment type data.
     *
     * @public
     */
    componentDidMount() {
        const { token } = AuthStore.getState();

        PaymentTypeActions.getList(token);
    }

    /**
     * Payment type data update modal close handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the data is being updated
     */
    closeHandler(isUpdating) {
        if (isUpdating) {
            PaymentTypeActions.setIsUpdating(false);
        } else {
            PaymentTypeActions.setIsCreating(false);
        }
    }

    /**
     * Data update submit handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the data is being updated
     * @param {Object} updatable Updatable
     * @param {Object} event Event object
     * @returns {*}
     */
    submitHandler(isUpdating, updatable, event) {
        event.preventDefault();

        const { token } = AuthStore.getState();
        const { name, amount } = updatable;

        if (!name) {
            return toastr.error('Maksājuma tipa nosaukums ievadīts kļūdaini');
        }

        PaymentTypeActions.setIsRequesting(true);

        if (isUpdating) {
            this.update(updatable, token);
        } else {
            this.create(updatable, token);
        }
    }

    /**
     * Initiates create entry modal by setting is the is creating store property to true.
     *
     * @public
     */
    initCreate() {
        PaymentTypeActions.clearUpdatable({});
        PaymentTypeActions.setIsCreating(true);
    }

    /**
     * Sends an update request to the back-end.
     *
     * @param {Object} updatable Updatable entry
     * @param {string} token Authentication token
     */
    update(updatable, token) {
        PaymentTypeActions.update(updatable, token)
            .done(() => {
                PaymentTypeActions.setIsRequesting(false);
                PaymentTypeActions.setIsUpdating(false);
            })
            .fail(() => PaymentTypeActions.setIsRequesting(false));
    }

    /**
     * Calls the method to create a new payment.
     *
     * @public
     * @param {Object} updatable Updatable entry
     * @param {string} token Authentication token
     */
    create(updatable, token) {
        PaymentTypeActions.create(updatable, token)
            .done(() => this._onPaymentUpdated())
            .fail(() => PaymentTypeActions.setIsRequesting(false));
    }

    /**
     * Renders the entry.
     *
     * @public
     * @param {Object} entry Entry
     * @param {number} index Entry index
     * @returns {string} HTML markup
     */
    renderList(entry, index) {
        return (
            <PaymentEntry
                key={`PaymentTypeEntry${index}`}
                index={index}
                entry={entry} />
        );
    }

    /**
     * Sets the is creating and is requesting flags to false.
     *
     * On the creating flag change, the modal should close too.
     *
     * @private
     */
    _onPaymentUpdated() {
        PaymentTypeActions.setIsCreating(false);
        PaymentTypeActions.setIsRequesting(false);
    }

    /**
     * Renders payment data table and the manage modal.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const {
            list, updatable,
            isUpdating, isCreating
        } = this.props;
        const shouldShow = isUpdating || isCreating;
        const columns = ['#', 'Nosaukums', 'Maksa', 'Vai ir noteikts skaits?', 'Darbības'];

        return (
            <Row>
                <Col xs={12}>
                    <Button
                        bsStyle="success"
                        onClick={this.initCreate.bind(this)}>
                        Izveidot
                    </Button>
                </Col>
                <Col xs={12}>
                    <Table responsive>
                        <thead>
                            <tr>{columns.map((col, index) => <th key={`PaymentTypeTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index) )}
                        </tbody>
                    </Table>
                </Col>
                <ManagePaymentType
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <PaymentTypeFields />
                </ManagePaymentType>
            </Row>
        );
    }
}

export default connectToStores(PaymentTypeData);
