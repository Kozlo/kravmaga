/**
 * Users controller.
 */

const helpers = require('../helpers/index');
const userHelpers = require('../helpers/users');
const User = require('../models/user');

module.exports = {

    /**
     * Retrieves all users based on the passed filters.
     *
     * Checks if the authenticated user is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    create(req, res) {
        // const newUserProps = userHelpers.createUser(res, req.body);
        const newUserProps = req.body;

        // TODO: somehow add password validation (preferable in the mongoose model)

        // User.create(newUserProps)
        User.create(newUserProps)
            .then(user => res.status(200).send(user))
            .catch(err => {
                console.log("ERROR:", err);
                helpers.handleError(res, err, 'Error creating user')
            });
    }//,

    // /**
    //  * Retrieves all users based on the passed filters.
    //  *
    //  * Checks if the authenticated user is an admin.
    //  *
    //  * @public
    //  * @param {Object} req Request object.
    //  * @param {Object} res Response object
    //  */
    // get(req, res) {
    //     const authUserId = req.payload.sub;
    //
    //     User.findById(authUserId)
    //         .then(authUser => {
    //             userHelpers.confirmUserIsValidAdmin(res, authUser, authUserId);
    //
    //             // TODO: add filter validation
    //
    //             return User.find().sort({ 'updatedAt': -1 });
    //         })
    //         .then(users => res.status(200).send(users))
    //         .catch(err => handleError(res, err, 'Error retrieving users'));
    // },
    //
    // /**
    //  * Retrieves a single user.
    //  *
    //  * Checks if the authenticated user checks his/her own profile or is an admin.
    //  *
    //  * @public
    //  * @param {Object} req Request object.
    //  * @param {Object} res Response object
    //  */
    // getOne(req, res) {
    //     const id = req.params.id;
    //     const authUserId = req.payload.sub;
    //
    //     if (!userHelpers.isUserIdValid(res, id)) return;
    //     if (!userHelpers.isUserIdValid(res, authUserId)) return;
    //
    //     User.findById(authUserId)
    //         .then(authUser => {
    //             userHelpers.confirmUserExists(res, authUser, authUserId);
    //             userHelpers.confirmUserIsNotBlocked(res, authUser);
    //             userHelpers.confirmUserHasRights(res, authUser, id);
    //
    //             return User.findById(id);
    //         })
    //         .then(user => {
    //             if (!user) helpers.throwError(res, `User with ID ${id} not found`, 404);
    //
    //             return res.status(200).send(user);
    //         })
    //         .catch(err => helpers.handleError(res, err, `Error retrieving user with ID ${id}`));
    //
    // },
    //
    // /**
    //  * Updated the specified user.
    //  *
    //  * Checks if the authenticated user updates his/her own profile or is an admin.
    //  *
    //  * @public
    //  * @param {Object} req Request object.
    //  * @param {Object} res Response object
    //  */
    // update(req, res) {
    //     const updatableUserId = req.params.id;
    //     const authUserId = req.payload.sub;
    //
    //     if (!userHelpers.isUserIdValid(res, updatableUserId)) return;
    //     if (!userHelpers.isUserIdValid(res, authUserId)) return;
    //
    //     User.findById(authUserId)
    //         .then(authUser => {
    //             userHelpers.confirmUserExists(res, authUser, authUserId);
    //             userHelpers.confirmUserIsNotBlocked(res, authUser);
    //             userHelpers.confirmUserHasRights(res, authUser, updatableUserId);
    //
    //             const updatableProps = req.body;
    //             // TODO: replace this with something else
    //             const newProps = userHelpers.updateUser(res, updatableProps, authUser);
    //             const options = { 'new': true };
    //
    //             return User.findByIdAndUpdate(updatableUserId, newProps, options);
    //         })
    //         .then(updatedUser => {
    //             userHelpers.confirmUserExists(res, updatedUser, updatableUserId);
    //
    //             res.status(200).send(updatedUser);
    //         })
    //         .catch(err => helpers.handleError(res, err, `Error updating user with ID ${updatableUserId}`));
    // },
    //
    // /**
    //  * Deletes the specified user.
    //  *
    //  * Checks if the authenticated user is an admin.
    //  *
    //  * @public
    //  * @param {Object} req Request object.
    //  * @param {Object} res Response object
    //  */
    // delete(req, res) {
    //     const deletableUserId = req.params.id;
    //     const authUserId = req.payload.sub;
    //
    //     User.findById(authUserId)
    //         .then(authUser => {
    //             userHelpers.confirmUserExists(res, authUser, authUserId);
    //             userHelpers.confirmUserIsNotBlocked(res, authUser);
    //             userHelpers.confirmUserHasRights(res, authUser, deletableUserId);
    //
    //             return User.findByIdAndRemove(deletableUserId);
    //         })
    //         .then(deletedUser => {
    //             userHelpers.confirmUserExists(res, deletedUser, deletableUserId);
    //
    //             res.status(200).send(deletedUser);
    //         })
    //         .catch(err => helpers.handleError(res, err, `Error deleting user with ID ${deletableUserId}`));
    // }

};
