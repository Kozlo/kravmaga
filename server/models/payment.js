const mongoose = require('mongoose');
const { isObjectIdValid } = require('../helpers/modelValidators');

/**
 * Schema properties.
 *
 * @property {String} payee ID of the user who has the payment
 * @property {Date} paymentDate The date the user has to make the payment on
 * @property {Date} paymentType The type of the payment the user is making
 * @property {Number} amount The amount a user has to pay for this payment
 * @property {Date}  validFrom The date from which the payment is valid from
 * @property {Date} validTo The date until when the payment is valid to
 * @property {Number} totalLessons The total number of lessons the user can attend for this payment
 * @property {Number} userLessons The number of lessons the user has used up so far
 */
const properties = {
    payee: {
        type: String,
        required: true,
        validate: {
            validator: isObjectIdValid,
            message: '{VALUE} is not a valid user ID'
        }
    },
    paymentDate: {
        type: Date,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
        message: '{VALUE} is not a valid payment amount'
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true
    },
    totalLessons: {
        type: Number,
        required: true,
        min: 0,
        message: '{VALUE} is not a valid payment lesson count'
    },
    usedLessons: {
        type: Number,
        required: true,
        min: 0,
        message: '{VALUE} is not a valid payment used lesson count'
    }
};

const schema = new mongoose.Schema(properties);

module.exports = mongoose.model('Payment', schema);
