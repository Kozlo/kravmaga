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
        const user = userHelpers.createUser(res, profile);

        if (!user) return;

        User.create(user)
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
        const authUserId = req.payload.sub;

        // TODO: add filters

        User.findOne({ user_id: authUserId })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with user_id ${authUserId} not found`, 404);

                if (authUser.is_admin !== true) {
                    helpers.throwError(res, `Only admins can view all users. Authenticated user with ID ${authUser._id} is not an admin`, 403);
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
        const authUserId = req.payload.sub;

        if (!userHelpers.isUserIdValid(res, id)) return;
        if (!userHelpers.isUserIdValid(res, authUserId)) return;

        User.findOne({ user_id: authUserId })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with user_id ${authUserId} not found`, 404);

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
        const authUserId = req.payload.sub;

        if (!userHelpers.isUserIdValid(res, id)) return;
        if (!userHelpers.isUserIdValid(res, authUserId)) return;

        User.findOne({ user_id: authUserId })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with user_id ${authUserId} not found`, 404);

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
        const authUserId = req.payload.sub;

        User.findOne({ user_id: authUserId })
            .then(authUser => {
                if (!authUser) helpers.throwError(res, `Authenticated user with user_id ${authUserId} not found`, 404);

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