/**
 * Configurable data used withing the application.
 */

/**
 * General configuration used withing the app.
 *
 * @property {string} dateFormat Format for date-only date strings
 * @property {string} defaultUserRole Role used for new users by default
 */
export const generalConfig = {
    dateFormat: 'DD/MM/YYYY',
    defaultUserRole: 'user'
};

/**
 * User field names.
 *
 * @property {String[]} general General fields that users can update for themselves.
 * @property {String[]} admin_fields Fields only updatable by admin users
 * @property {String[]} Roles available to users
 */
export const userFieldNames = {
    general: ['_id', 'picture', 'given_name', 'family_name', 'email', 'phone', 'gender', 'birthdate', 'member_since'],
    admin_fields: ['role', 'is_blocked']
};

/**
 * Group field names.
 */
export const groupFieldNames = ['_id', 'name'];

/**
 * Links to assets used within the app.
 *
 * @property {string} defaultImage Image used for users with no defined picture
 */
export const assets = {
    defaultImage: './assets/generic_user.svg'
};
