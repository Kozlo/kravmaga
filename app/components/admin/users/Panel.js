import React from 'react';

import PagePanel from '../../shared/PagePanel';
import UserData from './Data';

class UsersPanel extends React.Component {
    render() {
        return (
            <PagePanel title="Lietotāji">
                <UserData />
            </PagePanel>
        );
    }
}

export default UsersPanel;

