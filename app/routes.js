import React from 'react';
import { Router, IndexRoute, Route, browserHistory } from 'react-router';

import App from './components/App';
import Login from './components/Login';
import UserContainer from './components/user/Container';
import AdminContainer from './components/admin/Container';

import AuthStore from './stores/AuthStore';

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
            <IndexRoute component={UserContainer} onEnter={requireAuth} />
            <Route path='admin' component={AdminContainer} onEnter={isAdmin} />
            <Route path='login' component={Login} onEnter={userLoggedOn} />
            <Route path='*' component={UserContainer} onEnter={requireAuth} />
        </Route>
    </Router>
);
