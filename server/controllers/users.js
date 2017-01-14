/**
 * Users controller.
 */

const helpers = require('../helpers/common');
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
        const profile = req.body;
        const auth_id = profile.user_id;

        if (!userHelpers.isUserIdValid(res, auth_id)) return;

        User.findOne({ auth_id })
            .then(user => {
                if (user) helpers.throwError(res, `User with auth_id ${auth_id} already exists`, 409);

                const userProps = userHelpers.createUser(res, profile);

                if (!userProps) helpers.throwError(res, 'Some of the user props for profile are not valid', 400);

                return User.create(userProps);
            })
            .then(user => res.status(200).send(user))
            .catch(err => helpers.handleError(res, err, 'Error creating user'));
    },

    /**
     * Retrieves all users based on the passed filters.
     *
     * Checks if the authenticated user is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    get(req, res) {
        const auth_id = req.payload.sub;

        // TODO: add filters

        User.findOne({ auth_id })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with auth_id ${auth_id} not found`, 404);

                // TODO: add auth_id filter and allow users to get their own user data based on auth_id
                if (authUser.is_admin !== true) {
                    helpers.throwError(res, `Only admins can view other users. Authenticated user with ID ${authUser._id} is not an admin`, 403);
                }

                return User.find();
            })
            .then(users => res.status(200).send(users))
            .catch(err => handleError(res, err, 'Error retrieving users'));
    },

    /**
     * Retrieves a single user.
     *
     * Checks if the authenticated user checks his/her own profile or is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    getOne(req, res) {
        const id = req.params.id;
        const auth_id = req.payload.sub;

        if (!userHelpers.isUserIdValid(res, id)) return;
        if (!userHelpers.isUserIdValid(res, auth_id)) return;

        User.findOne({ auth_id })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with auth_id ${auth_id} not found`, 404);

                if (!authUser._id.equals(id) && authUser.is_admin !== true) {
                    helpers.throwError(res, `Only admins can view other users. Authenticated user with ID ${authUser._id} is not an admin`, 403);
                }

                return User.findById(id);
            })
            .then(user => {
                if (!user) helpers.throwError(res, `User with ID ${id} not found`, 404);

                return res.status(200).send(user);
            })
            .catch(err => helpers.handleError(res, err, `Error retrieving user with ID ${id}`));

    },

    /**
     * Updated the specified user.
     *
     * Checks if the authenticated user updates his/her own profile or is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    update(req, res) {
        const id = req.params.id;
        const profile = req.body;
        const auth_id = req.payload.sub;

        if (!userHelpers.isUserIdValid(res, id)) return;
        if (!userHelpers.isUserIdValid(res, auth_id)) return;

        User.findOne({ auth_id })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with auth_id ${auth_id} not found`, 404);

                if (!authUser._id.equals(id) && authUser.is_admin !== true) {
                    helpers.throwError(res, `Only admins can update other users. Authenticated user with ID ${authUser._id} is not an admin`, 403);
                }

                const newProps = userHelpers.updateUser(res, profile, authUser);

                if (!newProps) helpers.throwError(res, `User with ID ${id} could not be updated`, 403);

                return User.findByIdAndUpdate(id, newProps);
            })
            .then(user => {
                if (!user) helpers.throwError(res, `User with ID ${id} not found`, 404);

                res.status(200).send(user);
            })
            .catch(err => helpers.handleError(res, err, `Error updating user with ID ${id}`));
    },

    /**
     * Deletes the specified user.
     *
     * Checks if the authenticated user is an admin.
     *
     * @public
     * @param {Object} req Request object.
     * @param {Object} res Response object
     */
    delete(req, res) {
        const id = req.params.id;
        const auth_id = req.payload.sub;

        User.findOne({ auth_id })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with auth_id ${auth_id} not found`, 404);

                if (authUser.is_admin !== true) {
                    helpers.throwError(res, `Only admins can delete other users. Authenticated user with ID ${authUser._id} is not an admin`, 403);
                }

                return User.findByIdAndRemove(id);
            })
            .then(user => {
                if (!user) helpers.throwError(res, `User with ID ${id} not found`, 404);

                res.status(200).send(user);
            })
            .catch(err => helpers.handleError(res, err, `Error deleting user with ID ${id}`));
    }

};
