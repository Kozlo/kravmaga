import React from 'react';

import UserActions from '../../actions/UserActions';

import Page from '../shared/Page';
import ProfilePanel from './profile/Panel';

/**
 * Component for viewing a specific user's info.
 */
class UserView extends React.Component {
    /**
     * Sets the viewable user for the UserStore based on the URL param viewableUserId.
     */
    componentWillMount() {
        const { viewableUserId } = this.props.params;

        UserActions.setViewableUserId(viewableUserId);
    }

    /**
     * Makes sure the viewableUserId is cleared when the component unmounts so that the profile page is rendered correctly.
     */
    componentWillUnmount() {
        UserActions.clearViewableUserId();
    }

    /**
     * Renders the profile panel.
     */
    render() {
        return (
            <Page title="Krav Maga">
                <ProfilePanel />
            </Page>
        );
    }
}

export default UserView;

