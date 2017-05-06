// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import PaymentActions from '../../../actions/PaymentActions';

/** Payment data entry presentation component. */
class PaymentTypeEntry extends React.Component {
    /**
     * Clears the updatable and sets the updating flag to true to show the modal.
     *
     * @public
     * @param {Object} entry Entry
     */
    initUpdateEntry(entry) {
        PaymentActions.clearUpdatable(entry);
        PaymentActions.setIsUpdating(true);
    }

    /**
     * Delete's the specified entry and requests.
     *
     * @param {Object} entry Entry
     */
    deleteEntry(entry) {
        const { _id, name } = entry;
        // TODO: add some payment-specific text here
        const confirmText = 'Vai esi drošs, ka vēlies izdzēst maksājumu';

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        PaymentActions.delete(_id, token);
    }

    /**
     * Renders table cells, including action buttons.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { index, entry } = this.props;
        const { payee, paymentDate, paymentType, amount, validFrom, validTo, totalLessons, usedLessons } = entry;
        // TODO: see if this should be applied globally or not
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{payee}</td>
                {/*TODO: format the date*/}
                <td>{paymentDate}</td>
                <td>{paymentType}</td>
                {/*TODO: add currency*/}
                <td>{{amount}}</td>
                {/*TODO: format the date*/}
                <td>{{validFrom}}</td>
                {/*TODO: format the date*/}
                <td>{{validTo}}</td>
                <td>{{totalLessons}}</td>
                <td>{{usedLessons}}</td>
                <td style={btnColStyle}>
                    <ButtonToolbar>
                        <Button
                            bsStyle="info"
                            onClick={this.initUpdateEntry.bind(this, entry)}>
                            Labot
                        </Button>
                        <Button
                            bsStyle="danger"
                            onClick={this.deleteEntry.bind(this, entry)}>
                            Izdzēst
                        </Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }
}

export default PaymentTypeEntry;
