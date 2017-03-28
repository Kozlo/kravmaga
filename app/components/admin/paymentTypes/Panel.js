import React from 'react';

import PagePanel from '../../shared/PagePanel';
import PaymentTypeData from './Data';

/**
 * Payment type data container component.
 */
class PaymentTypesPanel extends React.Component {
    /**
     * Renders payment type data components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Maksājumu tipi">
                <p>Pre-definēti maksājumu tipi, kas nav tieši sasaistīti ar nodarbībām.</p>
                <PaymentTypeData />
            </PagePanel>
        );
    }
}

export default PaymentTypesPanel;

