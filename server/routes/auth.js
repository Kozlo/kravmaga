/**
 * Authentication routes.
 *
 * Routes for handling operations related to authentication.
 */

const express = require('express');
const router = express.Router();

const { login } = require('../controllers/auth');

/**
 * Login and logout routes.
 */
router
    .post('/login', login);

module.exports = router;
