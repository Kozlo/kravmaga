import React from 'react';

import PagePanel from '../../shared/PagePanel';
import PaymentData from './Data';
import PaymentFilters from './Filters';

/**
 * Payment data container component.
 */
class PaymentPanel extends React.Component {
    /**
     * Renders payment data components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Maksājumi">
                <h4>Filtri</h4>
                <PaymentFilters />

                <h4>Dati</h4>
                <PaymentData />
            </PagePanel>
        );
    }
}

export default PaymentPanel;

