import React from 'react';

import PagePanel from '../../shared/PagePanel';
import PaymentData from './Data';

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
                <PaymentData />
            </PagePanel>
        );
    }
}

export default PaymentPanel;

