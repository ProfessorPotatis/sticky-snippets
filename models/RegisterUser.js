/**
 * Mongoose model StickySnippet.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
//const SALTROUNDS = 10;

// Create a schema
let registerUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

// Validate password
registerUserSchema.path('password').validate(function(password) {
    return password.length >= 6;
}); // 'The password must be at least 6 characters long.'

// In the User model
// Using a pre-hook (runs before saving the user)
registerUserSchema.pre('save', function(next) {
    let user = this;
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }

        // Using https://www.npmjs.com/package/bcrypt-nodejs
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }

            // set the password to the hash
            user.password = hash;
            next();
        });
    });
});

// Create a model using the schema.
let RegisterUser = mongoose.model('RegisterUser', registerUserSchema);

// Export the model.
module.exports = RegisterUser;
