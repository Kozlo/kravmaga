import React from 'react';

import Page from '../shared/Page';
import ProfilePanel from './profile/Panel';
import LessonsPanel from './lessons/Panel';

class UserPage extends React.Component {
    render() {
        return (
            <Page title="Krav Maga">
                <ProfilePanel />
                <LessonsPanel />
            </Page>
        );
    }
}

export default UserPage;

