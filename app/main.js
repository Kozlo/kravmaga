import React from 'react';
import { Router, browserHistory } from 'react-router';
// TODO: check if React can be used since I'm not using server-side rendering anymore
import ReactDOM from 'react-dom';
import routes from './routes';

ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('app'));
