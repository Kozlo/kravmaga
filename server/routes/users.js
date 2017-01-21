/**
 * Users routes.
 */
const router = require('express').Router();
const requireAuth = require('express-jwt')({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});
const usersController = require('../controllers/users');

router.post('/', usersController.create);

// router.get('/users', requireAuth, usersController.get);
//
// router.get('/:id', requireAuth, usersController.getOne);
//
// router.patch('/:id', requireAuth, usersController.update);
//
// router.put('/:id', requireAuth, usersController.replace);
//
// router.delete('/:id', requireAuth, usersController.delete);

module.exports = router;
