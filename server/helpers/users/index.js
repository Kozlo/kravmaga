// /**
//  * Users helpers.
//  */
//
// const User = require('../../models/user');
// const helpers = require('../index');
// const config = require('../../config');
// const validate = require('./validators');
//
// module.exports = {
//
//     /**
//      * Determines if the passed user_id is valid. Raises an error if not.
//      *
//      * @public
//      * @param {Object} res Response object
//      * @param {string} userId User id
//      * @returns {boolean|undefined} Flag showing if the user id if valid or undefined if not
//      */
//     isUserIdValid(res, userId) {
//         if (!helpers.isValidString(userId)) {
//             const errorMessage = 'User ID is not valid';
//
//             return helpers.throwError(res, errorMessage, 401);
//         }
//
//         return true;
//     },
//
//     confirmUserIsValidAdmin(res, authUser, authUserId) {
//         return this.confirmUserExists(res, authUser, authUserId) &&
//             this.confirmUserIsAdmin(res, authUser) &&
//             this.confirmUserIsNotBlocked(res, authUser);
//     },
//
//     confirmUserExists(res, user, userId) {
//         if (!user) {
//             const errorMessage = `User with ID ${userId} not found`;
//
//             return helpers.throwError(res, errorMessage, 404);
//         }
//
//         return true;
//     },
//
//     confirmUserIsAdmin(res, user) {
//         if (user.is_admin !== true) {
//             const errorMessage = `User with ID ${user._id} is not an admin`;
//
//             return helpers.throwError(res, errorMessage, 403);
//         }
//
//         return true;
//     },
//
//     confirmUserIsNotBlocked(res, user) {
//         if (user.is_blocked !== false) {
//             const errorMessage = `User with auth_id ${user._id} is blocked`;
//
//             return helpers.throwError(res, errorMessage, 403);
//         }
//
//         return true;
//     },
//
//     confirmUserHasRights(res, user, id) {
//         const userViewingOwnProfile = user._id.equals(id);
//         const userIsAdmin = user.is_admin === true;
//
//         if (!userViewingOwnProfile && !userIsAdmin) {
//             const errorMessage = `Only admins can CRUD other users. User with ID ${user._id} is not an admin`;
//
//             return helpers.throwError(res, errorMessage, 403);
//         }
//
//         return true;
//     },
//
//     confirmUserDoesNotExist(res, user) {
//         if (user) {
//             const errorMessage = `User with email ${user.email} already exists. ID: ${user._id}`;
//
//             return helpers.throwError(res, errorMessage, 409);
//         }
//
//         return true;
//     },
//
//     /**
//      * Validates all passed user properties and returns the constructed object if appropriate.
//      *
//      * @public
//      * @param {Object} res Response to use in case of errors.
//      * @param {Object} props Properties for the new user.
//      * @returns {Object|undefined} Object with valid user properties if validated.
//      */
//     createUser(res, props) {
//         if (validate.propsObject) return false;
//
//         const user = new User();
//         const { email, password } = props;
//
//         // validate mandatory properties
//         if (!validate.email(res, email, user)) return false;
//         if (!validate.password(res, password, user)) return false;
//
//
//         // TODO: move this to validators in a new method called add/create optional properties
//         // validate optional properties
//         const { strings, boolean } = config.user.propNames.optional;
//         if (!validate.optionalProps(strings, validate.stringProp)) return false;
//         if (!validate.optionalProps(boolean, validate.boolProp)) return false;
//
//         return user;
//     }
// };
