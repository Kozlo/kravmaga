// dependencies
import React from 'react';
import { Button, Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';
import UserActions from '../../../actions/UserActions';

// components
import PaymentEntry from './Entry';
import ManagePayment from './ManagePayment';
import PaymentFields from './PaymentFields';

/**
 * Payment data presentation component.
 *
 * Payment data is just just plain text data without any relations.
 */
class PaymentData extends React.Component {
    static getStores() {
        return [PaymentStore];
    }

    static getPropsFromStores() {
        return PaymentStore.getState();
    }

    /**
     * Retrieves payment data.
     *
     * @public
     */
    componentDidMount() {
        const { token } = AuthStore.getState();

        UserActions.getList(token, PaymentActions.usersReceived);
        PaymentActions.getList(token);
    }

    /**
     * Payment data update modal close handler.
     *
     * @public
     * @param {boolean} isUpdating Flag showing if the data is being updated
     */
    closeHandler(isUpdating) {
        if (isUpdating) {
            PaymentActions.setIsUpdating(false);
        } else {
            PaymentActions.setIsCreating(false);
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
        const {
            payee, paymentDate, paymentType,
            amount, validFrom, validTo,
            totalLessons, usedLessons
        } = updatable;

        if (!payee || !paymentDate || !paymentType || !amount || !validFrom || !validTo || !totalLessons || !usedLessons) {
            return toastr.error('Lūdzu ievadiet visus obligātos laukus!');
        }

        PaymentActions.setIsRequesting(true);

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
        PaymentActions.clearUpdatable({});
        PaymentActions.setIsCreating(true);
    }

    /**
     * Sends an update request to the back-end.
     *
     * @param {Object} updatable Updatable entry
     * @param {string} token Authentication token
     */
    update(updatable, token) {
        PaymentActions.update(updatable, token)
            .done(() => {
                PaymentActions.setIsRequesting(false);
                PaymentActions.setIsUpdating(false);
            })
            .fail(() => PaymentActions.setIsRequesting(false));
    }

    /**
     * Calls the method to create a new payment.
     *
     * @public
     * @param {Object} updatable Updatable entry
     * @param {string} token Authentication token
     */
    create(updatable, token) {
        PaymentActions.create(updatable, token)
            .done(() => this._onPaymentUpdated())
            .fail(() => PaymentActions.setIsRequesting(false));
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
        const { users } = this.props;

        return (
            <PaymentEntry
                key={`PaymentEntry${index}`}
                index={index}
                entry={entry}
                users={users} />
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
        PaymentActions.setIsCreating(false);
        PaymentActions.setIsRequesting(false);
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
        const columns = ['#', 'Maksātājs', 'Maksājuma datums', 'Maksājuma tips', 'Daudzums', 'Derīgs no', 'Derīgs līdz', 'Nodarbību skaits', 'Izmantotās nodarbības'];

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
                            <tr>{columns.map((col, index) => <th key={`PaymentTableHeader${index}`}>{col}</th>)}</tr>
                        </thead>
                        <tbody>
                        {list.map((entry, index) => this.renderList(entry, index) )}
                        </tbody>
                    </Table>
                </Col>
                <ManagePayment
                    shouldShow={shouldShow}
                    closeHandler={this.closeHandler.bind(this, isUpdating)}
                    submitHandler={this.submitHandler.bind(this, isUpdating, updatable)}>
                    <PaymentFields />
                </ManagePayment>
            </Row>
        );
    }
}

export default connectToStores(PaymentData);
