/**
 * Server.js
 *
 * Entry point for the Krav-Maga CRM application.
 */

//=================
// Dependencies
//=================

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//=================
// DB setup
//=================

const database = process.env.DB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(database, () => console.log(`Successfully connected to the DB: ${database}`));
mongoose.connection.on('error', () => console.info(`Error: Could not connect to MongoDB ${database}: `, err));

//=================
// App setup
//=================

const app = express();

// Express middleware
app.set('port', process.env.PORT || 3000);
// TODO: change this according to the environment
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
require('./routes/index')(app);

// Catch unauthorised errors
// TODO: figure out why this isn't caught
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.error('Unauthorized error:', err);
        res.status(401).json({ 'message': `${err.name}: ${err.message}` });
    }
});

app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});
