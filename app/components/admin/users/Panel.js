import React from 'react';

import PagePanel from '../../shared/PagePanel';
import UserData from './Data';
import UserFilters from './Filters';

/**
 * Users data and filter container component.
 */
class UsersPanel extends React.Component {
    /**
     * Renders user data and filters components.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Lietotāji">
                <h4>Filtri</h4>
                <UserFilters />

                <h4>Dati</h4>
                <UserData />
            </PagePanel>
        );
    }
}

export default UsersPanel;

