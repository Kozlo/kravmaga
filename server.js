// Babel ES6/JSX Compiler
require('babel-register');

process.env.PWD = process.cwd();

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
// Use native promises
mongoose.Promise = global.Promise;

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
app.use(express.static(path.join(process.env.PWD, 'public')));

// Routes
require('./routes')(app);

app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});