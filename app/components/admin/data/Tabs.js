import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import LocationPanel from './locations/Panel';
import PaymentTypesPanel from './paymentTypes/Panel';

/**
 *  Static data panel tab container.
 */
class DataTabs extends React.Component {
    /**
     * Renders the static data container.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <div>
                <h3>Statiskie Dati</h3>
                <Tabs defaultActiveKey={1} id="dataTabs">
                    <br />

                    <Tab eventKey={1} title="Lokācijas">
                        <LocationPanel />
                    </Tab>
                    <Tab eventKey={2} title="Maksājumu Tipi">
                        <PaymentTypesPanel />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default DataTabs;
