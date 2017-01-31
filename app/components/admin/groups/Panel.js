import React from 'react';

import PagePanel from '../../shared/PagePanel';
import GroupData from './Data';

class GroupsPanel extends React.Component {
    render() {
        return (
            <PagePanel title="Grupas">
                <GroupData />
            </PagePanel>
        );
    }
}

export default GroupsPanel;

