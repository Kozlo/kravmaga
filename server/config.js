/**
 * Configurable properties used throughout the app.
 */
module.exports = {
    user: {
        minPasswordLength: 5,
        propNames: {
            mandatory: {
                special:['email', 'password']
            },
            optional: {
                strings: ['given_name', 'family_name', 'gender', 'picture'],
                boolean: ['is_admin', 'is_blocked']
            }
        }
    }
};