// Babel ES6/JSX Compiler
require('babel-register');

// React dependencies
const swig  = require('swig');
const React = require('react');
const ReactDOM = require('react-dom/server');
const Router = require('react-router');
const routes = require('./app/routes');

// express-related dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

// DB files
const mongoose = require('mongoose');
const config = require('./config');

// Establish a DB connection
mongoose.connect(config.database, () => {
    console.log(`Successfully connected to the DB: ${config.database}`);
});
mongoose.connection.on('error', () => {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

// start the app
const app = express();

// Express middleware
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
require('./routes')(app);

// React middleware
app.use((req, res) => {
    Router.match({ routes: routes.default, location: req.url }, (err, redirectLocation, renderProps) => {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            const html = ReactDOM.renderToString(React.createElement(Router.RouterContext, renderProps));
            const page = swig.renderFile('views/index.html', { html: html });

            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});

app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});