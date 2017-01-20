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

// Passport-related variables
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authController = require('./controllers/auth');

//=================
// DB setup
//=================

const database = process.env.DB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(database, () => console.log(`Successfully connected to the DB: ${database}`));
mongoose.connection.on('error', () => console.info(`Error: Could not connect to MongoDB ${database}: `, err));

//=================
// Auth setup
//=================

// Passport (authentication) setup
passport.use(new LocalStrategy({ usernameField: 'email' }, authController.authenticate));
passport.serializeUser(authController.serializeUser);
passport.deserializeUser(authController.deserializeUser);

//=================
// App setup
//=================

const app = express();

// Express middleware
app.set('port', process.env.PORT || 3000);
// TODO: change this according to the environment
// TODO: read more on logger and what it does
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(process.cwd(), 'public')));

// passport-related middleware
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
require('./routes/index')(app);

const errorHandler = require('./errorHandler');

// add error handlers
app.use(errorHandler);

// Catch unauthorised errors
// app.use((err, req, res, next) => {
//     if (err.name === 'UnauthorizedError') {
//         console.error('Unauthorized error:', err);
//         res.status(401).json({ 'message': `${err.name}: ${err.message}` });
//     }
// });

app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});
