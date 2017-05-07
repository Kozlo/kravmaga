import React from 'react';

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
                <PaymentPanel />
                <LessonPanel />
                <UsersPanel />
                <GroupPanel />
                <LocationPanel />
                <PaymentTypePanel />
            </Page>
        );
    }
}

export default AdminPage;

