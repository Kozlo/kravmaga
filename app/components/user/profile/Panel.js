import React from 'react';

import ProfileData from './Data';

class ProfilePanel extends React.Component {

    render() {
        return (
                <div className="panel panel-default krav-maga-panel" >
                    <div className="panel-heading">
                        <h3>Mans profils</h3>
                    </div>
                    <div className="panel-body">
                        <ProfileData />
                    </div>
                </div>
        );
    }

}

export default ProfilePanel;
