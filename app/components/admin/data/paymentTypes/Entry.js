// dependencies
import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

// stores and actions
import AuthStore from '../../../../stores/AuthStore';
import PaymentTypeActions from '../../../../actions/PaymentTypeActions';

/**
 * Payment type data entry presentation component.
 */
class PaymentTypeEntry extends React.Component {
    /**
     * Clears the updatable and sets the updating flag to true to show the modal.
     *
     * @public
     * @param {Object} entry Entry
     */
    initUpdateEntry(entry) {
        PaymentTypeActions.clearUpdatable(entry);
        PaymentTypeActions.setIsUpdating(true);
    }

    /**
     * Delete's the specified entry and requests.
     *
     * @param {Object} entry Entry
     */
    deleteEntry(entry) {
        const { _id, name } = entry;
        const confirmText = `Vai esi drošs, ka vēlies izdzēst maksājumu tipu: ${name}?`;

        if (!confirm(confirmText)) {
            return;
        }

        const { token } = AuthStore.getState();

        PaymentTypeActions.delete(_id, token);
    }

    /**
     * Renders table cells, including action buttons.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { index, entry } = this.props;
        const { name, amount, hasCount } = entry;
        const hasCountValue = hasCount === true ? 'Jā' : 'Nē';
        const btnColStyle = { minWidth: '12.5em' };

        return (
            <tr>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>{amount}</td>
                <td>{hasCountValue}</td>
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
