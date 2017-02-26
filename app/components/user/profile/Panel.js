import React from 'react';

import PagePanel from '../../shared/PagePanel';
import ProfileData from './Data';

/**
 * Profile panel container.
 */
class ProfilePanel extends React.Component {
    /**
     * Renders profile data.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <PagePanel title="Profila Info">
                <ProfileData />
            </PagePanel>
        );
    }
}

export default ProfilePanel;
