
/**
 * Lessons routes.
 *
 * Routes for handling CRUD operations on lessons.
 */

const express = require('express');
const expressJwt = require('express-jwt');

const middleware = require('../middleware');
const controller = require('../controllers/lessons');

const router = express.Router();
const requireAuth = expressJwt({
    secret: process.env.JWT_SECRET
});

const {
    addIsAdmin, requireIsAdmin,
    attendanceForSelfOnly, canAccessSelfUnlessAdmin
} = middleware;
const {
    getAll, createOne, getOne,
    updateOne, deleteOne, getUserLessons,
    markAttending, removeAttending
} = controller;

/**
 * Add middleware that confirms that the user is authenticated and is an admin.
 */
router.all('*', requireAuth, addIsAdmin);

//=================
// CRUD operations
//=================

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
router.route('/userLessons/:id')
    .get(canAccessSelfUnlessAdmin, getUserLessons);

/**
 * Routes for adding/removing an attendee to a lesson.
 *
 * Non-admin users can only add/remove themselves as attendees.
 */
router.route('/:id/markAttending/:attendeeId')
    .patch(attendanceForSelfOnly, markAttending);
router.route('/:id/removeAttending/:attendeeId')
    .patch(attendanceForSelfOnly, removeAttending);

module.exports = router;
