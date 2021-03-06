/**
 * Payment routes.
 *
 * Routes for handling CRUD operations on payments.
 */

const express = require('express');
const expressJwt = require('express-jwt');

const middleware = require('../middleware');
const controller = require('../controllers/payments');

const router = express.Router();
const requireAuth = expressJwt({
    secret: process.env.JWT_SECRET
});

const {
    addIsAdmin, requireIsAdmin, canAccessSelfUnlessAdmin
} = middleware;
const {
    getAll, createOne, getOne,
    updateOne, deleteOne, getUserPayments
} = controller;

/**
 * Add middleware that confirms that the user is authenticated and is an admin.
 */
router.all('*', requireAuth, addIsAdmin);

/**
 * Get (all entries) and post (create) route handlers.
 * Both require that the user is an admin.
 */
router.route('/', requireIsAdmin)
    .get(getAll)
    .post(createOne);

/**
 * Get (view), patch (update), and delete route handlers for the entry with the specified ID.
 */
router.route('/:id', requireIsAdmin)
     .get(getOne)
     .patch(updateOne)
     .delete(deleteOne);

//=================
// Custom routes
//=================

/**
 * Routes for retrieving lessons for a specific user.
 *
 * Non-admin users can only see lessons for themselves.
 */
router.route('/userPayments/:id')
    .get(canAccessSelfUnlessAdmin, getUserPayments);

module.exports = router;
