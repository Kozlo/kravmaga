import React from 'react';
import { Route } from 'react-router';

import AuthStore from './stores/AuthStore';
import UserStore from './stores/UserStore';
import App from './components/App';
import Login from './components/Login';
import Profile from './components/Profile';
import Admin from './components/Admin';


// validate authentication for private routes
const requireAuth = (nextState, replace) => {
    if (!AuthStore.getState().isLoggedIn) {
       replace({pathname: '/login'})
    }
};

// redirect to profile (index route) if the user is authenticated
const userLoggedOn = (nextState, replace) => {
    if (AuthStore.getState().isLoggedIn) {
        replace({pathname: '/'})
    }
};

// requires the user to be logged in and an admin
const isAdmin = (nextState, replace) => {
    if (!AuthStore.getState().isLoggedIn || UserStore.getState().user.is_admin !== true) {
        replace({pathname: '/login'})
    }
};

export default (
    <Route component={App}>
        <Route path='/' component={Profile} onEnter={requireAuth} />
        <Route path='/admin' component={Admin} onEnter={isAdmin} />
        <Route path='/login' component={Login} onEnter={userLoggedOn} />
    </Route>
);
