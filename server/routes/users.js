/**
 * Users routes.
 *
 * Routes for handling CRUD operations on users.
 */

const express = require('express');
const expressJwt = require('express-jwt');

const middleware = require('../middleware');
const controller = require('../controllers/users');

const router = express.Router();
const requireAuth = expressJwt({
    secret: process.env.JWT_SECRET
});

const {
    addIsAdmin, requireIsAdmin,
    canAccessSelfUnlessAdmin
} = middleware;
const {
    getAll, createOne, getOne,
    updateOne, deleteOne
} = controller;

/**
 * Add middleware that confirms that the user is authenticated,
 * as well as add a flag showing if the user is an existing non-blocked admin.
 */
router.all('*', requireAuth, addIsAdmin);

/**
 * Get (all users) and post (create) route handlers.
 * Both require that the user is an admin.
 */
router.route('/')
    .get(requireIsAdmin, getAll)
    .post(requireIsAdmin, createOne);

/**
 * Get (view), patch (update), put (replace), and delete route handlers for the user with the specified ID.
 * Both get and patch are allowed for users viewing or updating own profiles, and all admin users.
 * Both put and delete are only allowed for admin users.
 */
router.route('/:id')
     .get(canAccessSelfUnlessAdmin, getOne)
     .patch(canAccessSelfUnlessAdmin, updateOne)
     .delete(requireIsAdmin, deleteOne);

module.exports = router;
