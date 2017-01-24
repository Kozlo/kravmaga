import React from 'react';

import ProfilePanel from './profile/Panel';
import LessonsPanel from './lessons/Panel';

class UserContainer extends React.Component {
    render() {
        return (
            <div className='container'>
                <h2>Krav Maga</h2>
                <ProfilePanel />
                <LessonsPanel />
            </div>
        );
    }
}

export default UserContainer;

