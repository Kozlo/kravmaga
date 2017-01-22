/**
 * Index routes.
 */

const express = require('express');
const router = express.Router();

const usersRoutes = require('./users');
const mainController = require('../controllers/');
const authController = require('../controllers/auth');

router.post('/login', authController.login);
// TODO: add a logout route

router.use('/users', usersRoutes);

router.get('*', mainController.getAll);

module.exports = router;
