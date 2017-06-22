import React from 'react';

import Page from '../shared/Page';
import ProfilePanel from './profile/Panel';
import LessonsPanel from './lessons/Panel';
import PaymentsPanel from './payments/Panel';

/**
 *  Profile page panel container.
 */
class UserPage extends React.Component {
    /**
     * Renders the profile and the lessons panels.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <Page title="Krav Maga">
                <ProfilePanel />
                <LessonsPanel />
                <PaymentsPanel />
            </Page>
        );
    }
}

export default UserPage;

