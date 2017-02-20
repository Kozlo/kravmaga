import React from 'react';

import UserActions from '../../actions/UserActions';

import Page from '../shared/Page';
import ProfilePanel from './profile/Panel';

class UserView extends React.Component {
    componentWillMount() {
        const { viewableUserId } = this.props.params;

        UserActions.setViewableUserId(viewableUserId);
    }

    render() {
        return (
            <Page title="Krav Maga">
                <ProfilePanel />
            </Page>
        );
    }
}

export default UserView;

