// dependencies
import React from 'react';

// utils
import { formatDateString } from '../../../utils/utils';

/**
 * Lesson entry data presentation component.
 */
class PaymentEntry extends React.Component {
    /**
     * Renders the user profile panel data.
     *
     * If the component is not read-only, renders user profile actions.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        const { index, entry } = this.props;
        const {
            paymentDate, paymentType, amount,
            validFrom, validTo,
            totalLessons, usedLessons
        } = entry;
        const formattedPaymentDate = formatDateString(paymentDate);
        const formattedValidFrom = formatDateString(validFrom);
        const formattedValidTo = formatDateString(validTo);
        const paymentTypeName = paymentType === 'other' ? 'Cits' : paymentType;

        return (
            <tr>
                <td>{index + 1}</td>
                <td className="date-time-cell">{formattedPaymentDate}</td>
                <td>
                    <div className="cell-wrapper payment-type-cell">
                        {paymentTypeName}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper">
                        €{amount}
                    </div>
                </td>
                <td className="date-time-cell">{formattedValidFrom}</td>
                <td className="date-time-cell">{formattedValidTo}</td>
                <td>
                    <div className="cell-wrapper">
                        {totalLessons}
                    </div>
                </td>
                <td>
                    <div className="cell-wrapper">
                        {usedLessons}
                    </div>
                </td>
            </tr>
        );
    }
}

export default PaymentEntry;
