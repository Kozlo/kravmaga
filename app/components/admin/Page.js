import React from 'react';

import Page from '../shared/Page';
import LessonPanel from './lessons/Panel';
import UsersPanel from './users/Panel';
import GroupPanel from './groups/Panel';
import LocationPanel from './locations/Panel';

class AdminPage extends React.Component {
    render() {
        return (
            <Page title="Admin Panelis">
                <LessonPanel />
                <UsersPanel />
                <GroupPanel />
                <LocationPanel />
            </Page>
        );
    }
}

export default AdminPage;

