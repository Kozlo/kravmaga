import React from 'react';

import Page from '../shared/Page';
import LoginForm from './Form';

class LoginPage extends React.Component {
    render() {
        return (
            <Page>
                <LoginForm />
            </Page>
        );
    }
}

export default LoginPage;

