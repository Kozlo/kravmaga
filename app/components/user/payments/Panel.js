import React from 'react';

import PagePanel from '../../shared/PagePanel';
import PaymentData from './Data';
// TODO: add this later
// import PaymentFilters from '../../shared/payments/Filters';

/**
 * Payment data and filter container component.
 */
class PaymentsPanel extends React.Component {
    /**
     * Renders payment data and filters components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Maksājumi">
                {/*TODO: add this back later*/}
                {/*<h4>Filtri</h4>*/}
                {/*<PaymentFilters userPaymentsOnly={true} />*/}

                <h4>Dati</h4>
                <PaymentData />
            </PagePanel>
        );
    }
}

export default PaymentsPanel;
