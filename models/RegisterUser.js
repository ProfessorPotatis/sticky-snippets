/**
 * Mongoose model StickySnippet.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

// Create a schema
let registerUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        validate: {
          validator: function(value, callback) {
            RegisterUser.find({username: value}, function(err,docs){
               callback(docs.length === 0);
            });
          },
          message: 'User already exists. Please choose another username.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        //minlength: 6,
        validate: {
          validator: function(value) {
            return /^[a-z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/i.test(value);
          },
          message: 'Password must be at least 6 characters long.'
        }
    }
});

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

registerUserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, res) {
        if (err) {
            return cb(err);
        }
        cb(null, res);
    });
};

// Create a model using the schema.
let RegisterUser = mongoose.model('RegisterUser', registerUserSchema);

// Export the model.
module.exports = RegisterUser;
