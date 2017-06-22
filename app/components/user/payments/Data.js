// dependencies
import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import connectToStores from 'alt-utils/lib/connectToStores';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import PaymentStore from '../../../stores/PaymentStore';
import PaymentActions from '../../../actions/PaymentActions';

// components
import PaymentEntry from './Entry';

/**
 * Payment data presentation component.
 */
class PaymentData extends React.Component {
    static getStores() {
        return [PaymentStore];
    }

    static getPropsFromStores() {
        return PaymentStore.getState();
    }

    /**
     * Requests the data.
     *
     * @public
     */
    componentDidMount() {
        const { token, userId } = AuthStore.getState();
        const { filters, sorters, config } = this.props;

        PaymentActions.getUserPaymentList(token, userId, filters, sorters, config);
    }

    /**
     * Resets lesson filters.
     *
     * @public
     */
    componentWillUnmount() {
        PaymentActions.resetFilters();
    }

    /**
     * Payment entry renderer.
     *
     * @public
     * @param {string} entry Entry data to visualize
     * @param {number} index Entry array index
     * @returns {string} HTML markup
     */
    renderList(entry, index) {
        return (
            <PaymentEntry
                key={`PaymentEntry${index}`}
                index={index}
                entry={entry}/>
        );
    }

    /**
     * Renders payment data in a table.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { list } = this.props;
        const columns = ['#', 'Datums', 'Tips', 'Summa', 'Derīgs No', 'Derīgs Līdz', 'Nodarbību skaits', 'Izmantotās nodarbības'];

        return (
            <Row>
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
            </Row>
        );
    }
}

export default connectToStores(PaymentData);
