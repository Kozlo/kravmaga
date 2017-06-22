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

// Admin panels
import LessonPanel from './components/admin/lessons/Panel';
import UsersPanel from './components/admin/users/Panel';
import GroupPanel from './components/admin/groups/Panel';
import PaymentPanel from './components/admin/payments/Panel';
import DataTabs from './components/admin/data/Tabs';

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
            <Route path='admin' component={AdminPage} onEnter={isAdmin}>
                <IndexRoute component={PaymentPanel} />
                <Route path='payments' component={PaymentPanel} />
                <Route path='lessons' component={LessonPanel} />
                <Route path='users' component={UsersPanel} />
                <Route path='groups' component={GroupPanel} />
                <Route path='data' component={DataTabs} />
            </Route>
            <Route path='login' component={LoginPage} onEnter={userLoggedOn} />
            <Route path='*' component={UserPage} onEnter={requireAuth} />
        </Route>
    </Router>
);
