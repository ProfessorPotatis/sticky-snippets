/**
 * Mongoose model StickySnippet.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

let mongoose = require('mongoose');

// Create a schema
let stickySnippetSchema = new mongoose.Schema({
    value: {
        type: String,
        required: 'A {PATH} is required!'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

// Create a model using the schema.
let StickySnippet = mongoose.model('StickySnippet', stickySnippetSchema);

// Export the model.
module.exports = StickySnippet;
