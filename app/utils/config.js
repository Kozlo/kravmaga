/**
 * Configurable data used withing the application.
 */

/**
 * User fields and their types.
 *
 * @property {String[]} general General fields that users can update for themselves.
 * @property {String[]} admin_fields Fields only updatable by admin users
 * @property {String[]} Roles available to users
 */
export const userFields = {
    general: ['_id', 'email', 'given_name', 'family_name', 'picture'],
    admin_fields: ['role', 'is_blocked'],
    roles: ['user', 'admin']
};
