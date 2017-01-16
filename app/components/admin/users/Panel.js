import React from 'react';

import ManageUser from './Manage';
import UserData from './Data';

class UserPanel extends React.Component {
    render() {
        return (
            <div className="panel panel-default krav-maga-panel" >
                <div className="panel-heading">
                    <h3>Lietotāji</h3>
                </div>
                <div className="panel-body">
                    <UserData />
                </div>

                <ManageUser />

            </div>
        );
    }
}

export default UserPanel;

