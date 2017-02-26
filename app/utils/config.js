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
    dateTimeFormat: 'DD-MM-YYYY HH:mm',
    defaultUserRole: 'user',
    api: {
        usersUrl: '/users',
        groups: {
            baseUrl: '/groups',
            userGroupUrl: '/userGroups'
        },
        lessons: {
            baseUrl: '/lessons',
            userLessonUrl: '/userLessons',
            attendanceUrls: {
                mark: '/markAttending',
                remove: '/removeAttending'
            }
        },
        locationsUrl: '/locations'
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
    email: 40,
    password: 30,
    phone: 25,
    textArea: 100,
    url: 300
};

/**
 * Filter config.
 *
 * @property {object} lessons Lessons config
 * @property {number} lessons.count.min Minimum amount of entries to show
 * @property {number} lessons.count.max Maximum amount of entries to show
 * @property {number} lessons.count.defaultAmount Default amount of entries to show
 * @property {number} users.count.min Minimum amount of entries to show
 * @property {number} users.count.max Maximum amount of entries to show
 * @property {number} user.count.defaultAmount Default amount of entries to show
 */
export const filterConfig = {
    lessons: {
        count: {
            min: 1,
            max: 99,
            defaultAmount: 10
        }
    },
    users: {
        count: {
            min: 1,
            max: 999,
            defaultAmount: 10
        }
    }
};

/**
 * User field names.
 *
 * @property {String[]} general General fields that users can update for themselves.
 * @property {String[]} admin_fields Fields only updatable by admin users
 */
export const userFieldNames = {
    general: ['_id', 'picture', 'given_name', 'family_name', 'email', 'phone', 'gender', 'birthdate'],
    admin_fields: ['role', 'is_blocked', 'member_since']
};

/**
 * Group field names.
 */
export const groupFieldNames = ['_id', 'name', 'members'];

/**
 * Location field names.
 */
export const locationFieldNames = ['_id', 'name'];

/**
 * Lesson field names.
 */
export const lessonFieldNames = ['_id', 'start', 'end', 'group', 'location', 'attendees', 'comment'];

/**
 * Links to assets used within the app.
 *
 * @property {string} defaultImage Image used for users with no defined picture
 */
export const assets = {
    defaultImage: '/assets/generic_user.svg'
};

/**
 * Column names used for data presentation.
 *
 * @type {string[]}
 */
export const userDataColumns = ['#', 'Bilde', 'Vārds, Uzvārds', 'E-pasts', 'Telefons', 'Dzimis', 'Dzimums', 'Klubā kopš', 'Statuss', 'Loma', 'Darbības'];
