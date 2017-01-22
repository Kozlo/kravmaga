const mongoose = require('mongoose');

const { userConfig } = require('../config');
const { setPassword, validPassword, generateJwt } = require('../helpers/users/model');
const { isEmailValid } = require('../helpers/index');

/**
 * User schema properties.
 *
 * @property {String} email Unique user email
 * @property {String} hash Hashed user password
 * @property {String} salt Salt used for hashing the password for extra security
 * @property {String} [given_name] User's given (first) name
 * @property {String} [family_name] User's family (last) name
 * @property {String} [picture] URL to the user's picture
 * @property {Object} admin_fields Fields only an admin user can modify
 * @property {String} admin_fields.role User's role
 * @property {Boolean} admin_fields.is_blocked Flag showing if the user has been blocked or not
 */
const properties = {
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: isEmailValid,
            message: '{VALUE} is not a valid phone number!'
        }
    },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    given_name: { type: String, trim: true },
    family_name: { type: String, trim: true },
    picture: { type: String, trim: true },
    admin_fields: {
        role: { type: String, required: true, enum: userConfig.roles },
        is_blocked: { type: Boolean, required: true, default: false }
    }
};

/**
 * User schema config.
 *
 * @property {boolean} timestamps Flag showing if createdAd and updatedAt fields should be generated for each user
 */
const config = { timestamps: true };
const userSchema = new mongoose.Schema(properties, config);

userSchema.methods.setPassword = setPassword;
userSchema.methods.validPassword = validPassword;
userSchema.methods.generateJwt = generateJwt;

module.exports = mongoose.model('User', userSchema);
