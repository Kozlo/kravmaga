import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import Page from '../shared/Page';
import LessonPanel from './lessons/Panel';
import UsersPanel from './users/Panel';
import GroupPanel from './groups/Panel';
import LocationPanel from './locations/Panel';
import PaymentPanel from './payments/Panel';
import PaymentTypePanel from './paymentTypes/Panel';

/**
 *  Admin page panel container.
 */
class AdminPage extends React.Component {
    /**
     * Renders the admin panel.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <Page title="Admin Panelis">
                <Tabs defaultActiveKey={1} id="userTabs">
                    <Tab eventKey={1} title="Maksājumi">
                        <PaymentPanel />
                    </Tab>
                    <Tab eventKey={2} title="Nodarbības">
                        <LessonPanel />
                    </Tab>
                    <Tab eventKey={3} title="Lietotāji">
                        <UsersPanel />
                    </Tab>
                    <Tab eventKey={4} title="Grupas">
                        <GroupPanel />
                    </Tab>
                    <Tab eventKey={5} title="Lokācijas">
                        <LocationPanel />
                    </Tab>
                    <Tab eventKey={6} title="Maksājumu Tipi">
                        <PaymentTypePanel />
                    </Tab>
                </Tabs>
            </Page>
        );
    }
}

export default AdminPage;

