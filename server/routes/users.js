/**
 * User routes.
 */
module.exports = (app, auth) => {

    const usersController = require('../controllers/users');

    app.post('/users', usersController.create);

    app.get('/users', auth, usersController.get);

    app.get('/users/:id', auth, usersController.getOne);

    app.patch('/users/:id', auth, usersController.update);

    // TODO: Add a PUT route as well

    app.delete('/users/:id', auth, usersController.delete);

};
