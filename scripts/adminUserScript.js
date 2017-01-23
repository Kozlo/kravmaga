/**
 * Script for creating an admin user if no admin users are present.
 */

// dependencies
const mongoose = require('mongoose');
// models
const User = require('../server/models/user.js');
// constants
const defaultAdminEmail = 'admin@kravmaga.lv';
const defaultAdminPassword = 'admin';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, () => {
    console.log(`Successfully connected to the DB: ${process.env.DB_URI}`);
    checkForAdmin();
});
mongoose.connection.on('error', err => console.error('Error: Could not connect to MongoDB: ', err));

function checkForAdmin() {
    const filters = { 'admin.fields.role': 'admin' };

    User.findOne(filters)
        .then(user => {
            if (user) {
                console.log('An admin was found, so no need to create one. Exiting...');
                process.exit();
            } else {
                createNewAdmin();
            }
        })
        .catch(err => {
            console.error('Error searching for admin user:', err);
            throw err;
        });
}

function createNewAdmin() {
    const user = new User();

    user.email = defaultAdminEmail;
    user.setPassword(defaultAdminPassword);
    user.admin_fields.role = 'admin';

    user.save((err, createdUser) => {
        if (err) {
            console.error('Error creating default admin user:', err);
            throw err;
        }

        console.log('Successfully created admin user: ', createdUser, 'exiting...');

        process.exit();
    });
}