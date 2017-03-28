const mongoose = require('mongoose');
const { isTextFieldValid } = require('../helpers/modelValidators');

/**
 * Schema properties.
 *
 * @property {String} name Payment type's name
 * @property {Number} amount The amount a user has to pay for this payment type
 * @property {Boolean} hasCount Flag showing if this payment type has a specific count of lessons
 */
const properties = {
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: isTextFieldValid,
            message: '{VALUE} is not a valid payment type name'
        }
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
        message: '{VALUE} is not a valid payment type amount'
    },
    hasCount: {
        type: Boolean,
        default: false
    }
};

const schema = new mongoose.Schema(properties);

module.exports = mongoose.model('PaymentType', schema);
