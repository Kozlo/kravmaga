import React from 'react';

import PagePanel from '../../shared/PagePanel';
import GroupData from './Data';

class GroupsPanel extends React.Component {
    render() {
        return (
            <PagePanel title="Grupas">
                <p>Grupas, kurām ir piesaistīti lietotāji.</p>
                <GroupData />
            </PagePanel>
        );
    }
}

export default GroupsPanel;

