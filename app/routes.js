import React from 'react';
import {
    Router, IndexRoute,
    Route, browserHistory
} from 'react-router';

import App from './components/App';
import LoginPage from './components/login/Page';
import UserPage from './components/user/Page';
import UserView from './components/user/View';
import AdminPage from './components/admin/Page';

import AuthStore from './stores/AuthStore';

/**
 * Validate authentication for private routes.
 */
const requireAuth = (nextState, replace) => {
    const isLoggedIn = !!AuthStore.getState().token;

    if (!isLoggedIn) {
       replace({pathname: '/login'})
    }
};

/**
 * Redirect to profile (index route) if the user is authenticated.
 */
const userLoggedOn = (nextState, replace) => {
    const isLoggedIn = !!AuthStore.getState().token;

    if (isLoggedIn) {
        replace({pathname: '/'})
    }
};

/**
 * Requires the user to be logged in and an admin.
 */
const isAdmin = (nextState, replace) => {
    const { token, userIsAdmin } = AuthStore.getState();

    if (!token) {
        replace({pathname: '/login'})
    } else if (userIsAdmin !== true) {
        replace({pathname: '/'})
    }
};

export default (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={UserPage} onEnter={requireAuth} />
            <Route path='user/:viewableUserId' component={UserView} onEnter={isAdmin} />
            <Route path='admin' component={AdminPage} onEnter={isAdmin} />
            <Route path='login' component={LoginPage} onEnter={userLoggedOn} />
            <Route path='*' component={UserPage} onEnter={requireAuth} />
        </Route>
    </Router>
);
