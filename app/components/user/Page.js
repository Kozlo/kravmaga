import React from 'react';

import UserActions from '../../actions/UserActions';

import Page from '../shared/Page';
import ProfilePanel from './profile/Panel';
import LessonsPanel from './lessons/Panel';

class UserPage extends React.Component {
    componentWillMount() {
        UserActions.clearViewableUserId();
    }

    render() {
        return (
            <Page title="Krav Maga">
                <ProfilePanel />
                <LessonsPanel />
            </Page>
        );
    }
}

export default UserPage;

