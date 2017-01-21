/**
 * Index routes.
 */

const router = require('express').Router();
const usersRoutes = require('./users');
const indexController = require('../controllers/index');
const authController = require('../controllers/auth');

router.post('/login', authController.login);
// TODO: add a logout route

router.use('/users', usersRoutes);

router.get('*', indexController.main);

module.exports = router;
