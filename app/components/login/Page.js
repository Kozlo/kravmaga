import React from 'react';

import Page from '../shared/Page';
import LoginForm from './Form';

/**
 *  Login page panel container.
 */
class LoginPage extends React.Component {
    /**
     * Renders the login panel.
     *
     * @public
     * @returns {string} HTML markup
     */
    render() {
        return (
            <Page>
                <LoginForm />
            </Page>
        );
    }
}

export default LoginPage;

