// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../stores/AuthStore';
import PaymentActions from '../../../actions/PaymentActions';

// utils
import { formatDateString } from '../../../utils/utils';

/** Payment data entry presentation component. */
class PaymentEntry extends React.Component {
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
        const {
            payee, paymentDate, paymentType,
            amount, validFrom, validTo,
            totalLessons, usedLessons
        } = entry;
        const formattedPaymentDate = formatDateString(paymentDate);
        const formattedValidFrom = formatDateString(validFrom);
        const formattedValidTo = formatDateString(validTo);

        // TODO: see if this should be applied globally or not
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                {/*TODO: get user data (not just the ID */}
                <td>{payee}</td>
                {/*/!*TODO: format the date*!/*/}
                <td>{formattedPaymentDate}</td>
                {/*TODO: transfor the name if it's custom to LV*/}
                <td>{paymentType}</td>
                {/*/!*TODO: add currency*!/*/}
                <td>{amount}</td>
                {/*/!*TODO: format the date*!/*/}
                <td>{formattedValidFrom}</td>
                {/*/!*TODO: format the date*!/*/}
                <td>{formattedValidTo}</td>
                <td>{totalLessons}</td>
                <td>{usedLessons}</td>
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

export default PaymentEntry;
