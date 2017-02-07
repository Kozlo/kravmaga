/**
 * Index routes.
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const groupsRoutes = require('./groups');
const lessonsRoutes = require('./lessons');
const { getAll } = require('../controllers/');

/**
 * Authentication and user routes.
 */
router.use('/', authRoutes);
router.use('/users', usersRoutes);
router.use('/groups', groupsRoutes);
router.use('/lessons', lessonsRoutes);

/**
 * Route for unrecognized get requests.
 */
router.get('*', getAll);

module.exports = router;
