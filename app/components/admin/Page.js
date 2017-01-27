import React from 'react';

import Page from '../shared/Page';
import UsersPanel from './users/Panel';

class AdminPage extends React.Component {
    render() {
        return (
            <Page title="Admin Panelis">
                <UsersPanel />
            </Page>
        );
    }
}

export default AdminPage;

