/**
 * Configurable data used withing the application.
 */

/**
 * User fields and their types.
 *
 * @property {String[]} admin_fields Fields only updatable by admin users
 * @property {String[]} Roles available to users
 */
export const userFields = {
    admin_fields: ['role', 'is_blocked'],
    roles: ['user', 'admin']
};
