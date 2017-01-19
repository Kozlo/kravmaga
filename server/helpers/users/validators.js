/**
 * Validators.
 *
 * Helper methods for validating properties passed for user CRUD operations.
 */

const helpers = require('../index');
const config = require('../../config');
const errors = config.error.validation.props;
const badRequest = config.error.status.badRequest;

module.exports = {
    propsObject() {
        if (!helpers.isObject(props)) {
            const errorMessage = 'Properties must be passed as a valid object';

            return helpers.throwError(res, errorMessage, 400);
        }

        return true;
    },

    email(res, email, user) {
        if (!helpers.isValidEmail(email)) {
            const errorMessage = `The passed email ${email} is not valid`;

            return helpers.throwError(res, errorMessage, 400);
        }

        user.email = email;

        return true;
    },

    password(res, password, user) {
        if (!helpers.isValidPassword(password)) {
            const errorMessage = `The passed password ${password} is not valid`;

            return helpers.throwError(res, errorMessage, 400);
        }

        user.setPassword(password);

        return true;
    },

    optionalProps(props, user, validator) {
        for (let i = 0; i < props.length; i++) {
            const name = props[i];

            // TODO: check if the property is undefined here and skip if so as it's optional
            // TODO: remove typeof undefined cehck in thei optional prop check methods
            // TODO: in the prop check methods only return true/false and act accordingly here
            // TODO: in the callee: 1) check if the returned is an error 2) pass the correct params (Currently worng)

            const isValid = validator(res, name, props, user);

            if (isValid) {

            }
            else {
                return {
                    error: errors.optional.boolean(name, value),
                    status: badRequest
                };
            }
        }

        return true;
    },

    stringProp(res, name, props, user) {
        const value = props[name];

        if (helpers.isTypeUndefined(value)) {
            return true;
        }

        if (!helpers.isTypeString(value)) {
            const errorMessage = `The passed user optional string property ${name} value ${value} is not valid`;

            return helpers.throwError(res, errorMessage, 400);
        }

        user[name] = value;

        return true;
    },

    boolProp(name, props, user) {
        const value = props[name];

        if (helpers.isTypeUndefined(value)) {
            return value;
        }

        if (helpers.isTypeBooleanOrEmptyString(value)) {
            user[name] = value;

            return value;
        }
    }
};
