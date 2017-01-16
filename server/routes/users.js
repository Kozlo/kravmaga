/**
 * User routes.
 */
module.exports = (app, auth) => {

    const users = require('../controllers/users');

    app.post('/users', users.create);

    app.get('/users', auth, users.get);

    app.get('/users/:id', auth, users.getOne);

    app.patch('/users/:id', auth, users.update);

    // TODO: Add a PUT route as well

    app.delete('/users/:id', auth, users.delete);

};
