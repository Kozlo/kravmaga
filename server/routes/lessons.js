
/**
 * Lessons routes.
 *
 * Routes for handling CRUD operations on lessons.
 */

const express = require('express');
const expressJwt = require('express-jwt');

const middleware = require('../middleware/index');
const controller = require('../controllers/lessons');

const router = express.Router();
const requireAuth = expressJwt({
    secret: process.env.JWT_SECRET
});

const { addIsAdmin, requireIsAdmin } = middleware;
const {
    getAll, createOne, getOne,
    updateOne, deleteOne
} = controller;

/**
 * Add middleware that confirms that the user is authenticated and is an admin.
 */
router.all('*', requireAuth, addIsAdmin, requireIsAdmin);

/**
 * Get (all entries) and post (create) route handlers.
 * Both require that the user is an admin.
 */
router.route('/')
    .get(getAll)
    .post(createOne);

/**
 * Get (view), patch (update), and delete route handlers for the entry with the specified ID.
 */
router.route('/:id')
     .get(getOne)
     .patch(updateOne)
     .delete(deleteOne);

module.exports = router;
