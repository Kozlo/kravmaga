import React from 'react';

import UserActions from '../../actions/UserActions';

import Page from '../shared/Page';
import ProfilePanel from './profile/Panel';

/**
 * User info panel container.
 */
class UserView extends React.Component {
    /**
     * Sets the viewable user for the UserStore based on the URL param viewableUserId.
     *
     * @public
     */
    componentWillMount() {
        const { viewableUserId } = this.props.params;

        UserActions.setViewableUserId(viewableUserId);
    }

    /**
     * Makes sure the viewableUserId is cleared when the component unmounts so that the profile page is rendered correctly.
     *
     * @public
     */
    componentWillUnmount() {
        UserActions.clearViewableUserId();
    }

    /**
     * Renders the profile panel.
     *
     * @public
     * @returns {string} HTML markup
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

