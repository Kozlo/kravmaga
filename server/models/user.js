const mongoose = require('mongoose');

const { setPassword, validPassword, generateJwt } = require('../helpers/usersHelpers');
const {
    isEmailValid,
    isTextFieldValid,
    isUrlFieldValid,
    isPhoneFieldValid
} = require('../helpers/modelValidators');

/**
 * Schema properties.
 *
 * @property {String} email Unique user email
 * @property {String} hash Hashed user password
 * @property {String} salt Salt used for hashing the password for extra security
 * @property {String} [given_name] User's given (first) name
 * @property {String} [family_name] User's family (last) name
 * @property {String} [picture] URL to the user's picture
 * @property {String} [phone] User's phone number
 * @property {String} [gender] User's gender
 * @property {String} [birthdate] User's date of birth
 * @property {Object} admin_fields Fields only an admin user can modify
 * @property {String} admin_fields.role User's role
 * @property {Boolean} admin_fields.is_blocked Flag showing if the user has been blocked or not
 * @property {String} [admin_fields.member_since] Date when the user became a member
 * @property {String} [admin_fields.attendance_count] Number of times the user has attended lessons
 */
const properties = {
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: isEmailValid,
            message: '{VALUE} is not a valid email!'
        }
    },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    given_name: {
        type: String,
        trim: true,
        validate: {
            validator: isTextFieldValid,
            message: '{VALUE} is not a valid first name'
        }
    },
    family_name: {
        type: String,
        trim: true,
        validate: {
            validator: isTextFieldValid,
            message: '{VALUE} is not a valid last name'
        }
    },
    picture: {
        type: String,
        trim: true,
        validate: {
            validator: isUrlFieldValid,
            message: '{VALUE} is not a valid url'
        }
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: isPhoneFieldValid,
            message: '{VALUE} is not a valid phone number'
        }
    },
    gender: { type: String, enum: ['', 'male', 'female'] },
    birthdate: Date,
    admin_fields: {
        role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
        is_blocked: { type: Boolean, required: true, default: false },
        member_since: Date,
        attendance_count: { type: Number, default: 0 }
    }
};

/**
 * User schema config.
 *
 * @property {boolean} timestamps Flag showing if createdAt and updatedAt fields should be generated for each user
 */
const config = { timestamps: true };
const schema = new mongoose.Schema(properties, config);

schema.methods.setPassword = setPassword;
schema.methods.validPassword = validPassword;
schema.methods.generateJwt = generateJwt;

module.exports = mongoose.model('User', schema);
