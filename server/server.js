/**
 * Server.js
 *
 * Entry point for the Krav-Maga CRM application.
 */

//=================
// Dependencies
//=================

const express = require('express');
const helmet = require('helmet');
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
mongoose.connection.on('error', err => console.info(`Error: Could not connect to MongoDB ${database}: `, err));

//=================
// Auth setup
//=================
const {
    authenticate,
    serializeUser,
    deserializeUser
} = authController;

// Passport (authentication) setup
passport.use(new LocalStrategy({ usernameField: 'email' }, authenticate));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

//=================
// App setup
//=================

const app = express();

// Express middleware
app.use(helmet());
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// passport-related middleware
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//=================
// Routes
//=================

const routes = require('./routes');

app.use('/', routes);

//=================
// Error handling
//=================

const { logErrors, clientErrorHandler, errorHandler } = require('./errorHandlers');

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

//=================
// Start the app
//=================

app.listen(app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
});
