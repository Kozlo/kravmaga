import React from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import App from './components/App';
import Login from './components/Login';
import Profile from './components/Profile';
import Admin from './components/Admin';

import AuthStore from './stores/AuthStore';
import UserStore from './stores/UserStore';

// validate authentication for private routes
const requireAuth = (nextState, replace) => {
    const isLoggedIn = !!AuthStore.getState().token;

    if (!isLoggedIn) {
       replace({pathname: '/login'})
    }
};

// redirect to profile (index route) if the user is authenticated
const userLoggedOn = (nextState, replace) => {
    const isLoggedIn = !!AuthStore.getState().token;

    if (isLoggedIn) {
        replace({pathname: '/'})
    }
};

// requires the user to be logged in and an admin
const isAdmin = (nextState, replace) => {
    const { token } = AuthStore.getState();
    const { is_admin } = UserStore.getState().user;

    if (!token) {
        replace({pathname: '/login'})
    } else if (is_admin !== true) {
        replace({pathname: '/'})
    }
};

export default (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Profile} onEnter={requireAuth} />
            <Route path='admin' component={Admin} onEnter={isAdmin} />
            <Route path='login' component={Login} onEnter={userLoggedOn} />
            <Route path='*' component={Profile} onEnter={requireAuth} />
        </Route>
    </Router>
);
