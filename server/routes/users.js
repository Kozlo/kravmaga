/**
 * User routes.
 */
module.exports = (app, auth) => {

    const usersController = require('../controllers/users');

    // router.get("*", function (req, res, next){ 	let test = { 		stuff: "hi" 	}; 	 	res.test = test; });
    //
    // function isAdmin(req, res, next) {
    //     //
    //     User.findById(authUserId)
    //         .then(authUser => {
    //             if (userHelpers.confirmUserIsValidAdmin(res, authUser, authUserId)) {
    //                 throw ;
    //             }
    //
    //             res.user = authUser;
    //
    //             next('route');
    //         })
    //         .catch(err => helpers.handleError(res, err, 'Error creating user'));
    // }

    app.post('/users', usersController.create);

    // app.get('/users', auth, usersController.get);
    //
    // app.get('/users/:id', auth, usersController.getOne);
    //
    // app.patch('/users/:id', auth, usersController.update);
    //
    // // TODO: Add a PUT route as well
    //
    // app.delete('/users/:id', auth, usersController.delete);

};
