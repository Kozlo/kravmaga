import React from 'react';

import PagePanel from '../../shared/PagePanel';
import GroupData from './Data';

/**
 * Group data and filter container component.
 */
class GroupsPanel extends React.Component {
    /**
     * Renders group data components.
     *
     * @public
     * @returns {string} HTML markup
     */
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

