import React from 'react';

import PagePanel from '../../shared/PagePanel';
import ProfileData from './Data';

class ProfilePanel extends React.Component {
    render() {
        return (
            <PagePanel title="Mans Profils">
                <ProfileData />
            </PagePanel>
        );
    }
}

export default ProfilePanel;
