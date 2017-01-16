import React from 'react';

import UserPanel from './users/Panel';

class AdminContainer extends React.Component {
    render() {
        return (
            <div className='container'>
                <h2>Admin Panelis</h2>
                <UserPanel />
            </div>
        );
    }
}

export default AdminContainer;

