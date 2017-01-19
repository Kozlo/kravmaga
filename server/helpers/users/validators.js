/**
 * Validators.
 *
 * Helper methods for validating properties passed for user CRUD operations.
 */

const helpers = require('../index');

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

    props(res, props, user, validator) {
        for (let i = 0; i < props.length; i++) {
            const name = props[i];
            const result = validator(res, name, props, user);

            if (!result) return false;
        }

        return true;
    },

    optStringProp(res, name, props, user) {
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

    optBoolProp(res, name, props, user) {
        const value = props[name];

        if (helpers.isTypeUndefined(value)) {
            return true;
        }

        if (helpers.isTypeBooleanOrEmptyString(value)) {
            user[name] = value;

            return true;
        }

        const errorMessage = `The passed user optional boolean property ${name} with value ${value} is not valid`;

        return helpers.throwError(res, errorMessage, 400);
    }
};
