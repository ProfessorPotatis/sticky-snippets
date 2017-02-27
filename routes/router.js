/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();
let StickySnippet = require('../models/StickySnippet.js');
console.log(StickySnippet);

router.route('/').get(function(req, res) {
    StickySnippet.find({}).exec()
            .then (function(doc) {
                console.log(doc);
                // TODO: Lazy programmer! I don't transform the document to a view model...
                res.render('home/index', { stickySnippets: doc });
            })
            .catch (function(err) {
                res.render('home/index', {
                    // DIRTY(?): Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    stickySnippets: []
                });
            });
    //res.render('home/index');
});

router.route('/create').get(function(req, res) {
    res.render('home/create', {value: undefined});
});

router.route('/create').post(function(req, res, next) {
    // Create a new stickySnippet.
        let stickySnippet = new StickySnippet({
            value: req.body.value
        });

        // Save the stickySnippet to the database.
        stickySnippet.save()
            .then(function() {
                // Redirect to homepage and show a message.
                req.session.flash = {type: 'success', text: 'The sticky snippet was saved successfully.'};
                res.redirect('/');
            })
            .catch(function(err) {
                // If a validation error occurred, view the form and an error message.
                if (err.errors.value.name === 'ValidatorError') {
                    // We handle the validation error!
                    return res.render('home/create', {
                        validationErrors: [err.errors.value.message],
                        value: req.body.value
                    });
                } else if (err.errors.value.name === 'CastError') {
                    // If it's a cast error we considers it's a bad request!
                    // (Maybe not the smartest thing to do, but WTF, we need to learn
                    // what to do if we want to change the status of the response.)
                    err.status = 400;
                }

                // Let the middleware handle any errors but ValidatorErrors.
                next(err);
            });
});

router.route('/register').get(function(req, res) {
    res.render('home/register');
});

router.route('/login').get(function(req, res) {
    res.render('home/login');
});


module.exports = router;
