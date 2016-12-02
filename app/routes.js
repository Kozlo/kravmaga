import React from 'react';
import { Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';

export default (
    <Route component={App}>
        {/*TODO: if the user is logged in, he/she should be redirected to profile page*/}
        <Route path='/' component={Home} />
    </Route>
);
