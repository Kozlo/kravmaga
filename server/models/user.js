const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// TODO: add validation to all of these

const schemaProps = {
    email: { type: String, unique: true, required: true },
    hash: String,
    salt: String,
    is_admin: { type: Boolean, required: true, default: false },
    is_blocked: { type: Boolean, required: true, default: false },
    given_name: String,
    family_name: String,
    gender: String,
    picture: String
};
const schemaConfig = { timestamps: true};
const userSchema = new mongoose.Schema(schemaProps, schemaConfig);

userSchema.methods.setPassword = function(password) {
    console.log(password);
    password = new Buffer(password, 'binary');

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    password = new Buffer(password, 'binary');

    return this.hash === crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

userSchema.methods.generateJwt = function() {
    let expiry = new Date();

    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000),
    }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('User', userSchema);
