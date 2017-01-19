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
    },
    error: {
        status: {
            badRequest: 400
        },
        validation: {
            props: {
                optional:  {
                    boolean: (name, value) => `The passed user optional boolean property ${name} with value ${value} is not valid`
                }
            }
        }
    }
};