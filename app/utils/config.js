/**
 * Configurable data used withing the application.
 */

/**
 * General configuration used withing the app.
 *
 * @property {string} dateOnlyFormat Format for date-only date strings
 * @property {string} dateTimeFormat Format for dates with time as well
 * @property {string} defaultUserRole Role used for new users by default
 * @property {Object} api Config for the api
 * @property {string} api.usersUrl Url for users
 * @property {string} api.groupsUrl Url for groups
 * @property {string} api.lessonUrl Url for lessons
 */
export const generalConfig = {
    dateOnlyFormat: 'DD-MM-YYYY',
    dateTimeFormat: 'DD-MM-YYYY H:m',
    defaultUserRole: 'user',
    api: {
        usersUrl: '/users',
        groupsUrl: '/groups',
        lessons:{
            baseUrl: '/lessons',
            userLessonUrl: '/userLessons',
            attendanceUrls: {
                mark: '/markAttending',
                remove: '/removeAttending'
            }
        }
    }
};

/**
 * Maximum input length configuration.
 *
 * @property {number} regularField Regular field (text, numeric etc.) length
 * @property {number} email Email
 * @property {number} password Password
 * @property {number} phone Phone number
 * @property {number} textArea Text area (e.g. lesson comment)
 */
export const maxInputLength = {
    regularField: 25,
    email: 30,
    password: 30,
    phone: 20,
    textArea: 100
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
export const groupFieldNames = ['_id', 'name', 'members'];

/**
 * Lesson field names.
 */
export const lessonFieldNames = ['_id', 'date', 'group', 'location', 'attendees', 'comment'];

/**
 * Links to assets used within the app.
 *
 * @property {string} defaultImage Image used for users with no defined picture
 */
export const assets = {
    defaultImage: './assets/generic_user.svg'
};
