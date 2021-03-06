/**
 * Index routes.
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const groupsRoutes = require('./groups');
const lessonsRoutes = require('./lessons');
const locationsRoutes = require('./locations');
const paymentsRoutes = require('./payments');
const paymentTypesRoutes = require('./paymentTypes');
const { getAll } = require('../controllers/');

/**
 * Routes used within the app.
 */
router.use('/', authRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/lessons', lessonsRoutes);
router.use('/locations', locationsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/paymentTypes', paymentTypesRoutes);

/**
 * Route for unrecognized get requests.
 */
router.get('*', getAll);

module.exports = router;
