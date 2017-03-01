/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();
let StickySnippet = require('../models/StickySnippet');
let RegisterUser = require('../models/RegisterUser');

router.route('/').get(function(req, res) {
    /*StickySnippet.remove({}, function(err) {
   console.log('collection removed');
});*/
    StickySnippet.find({}).exec()
            .then (function(data) {
                // Map the data
                let context = {
                    snippets: data.map(function(snippet) {
                        return {
                            value: snippet.value,
                            createdAt: snippet.createdAt,
                            id: snippet.id
                        };
                    })
                };
                return context.snippets;
            })
            .then (function(context) {
                res.render('home/index', { stickySnippets: context });
            })
            .catch (function(err) {
                res.render('home/index', {
                    // Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    stickySnippets: []
                });
            });
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

router.route('/update/:id').get(function(req, res) {
    StickySnippet.find({_id: req.params.id}).exec()
            .then (function(data) {
                // Map the data
                let context = {
                    snippets: data.map(function(snippet) {
                        return {
                            value: snippet.value,
                            createdAt: snippet.createdAt,
                            id: snippet.id
                        };
                    })
                };
                return context.snippets;
            })
            .then (function(context) {
                res.render('home/update', { stickySnippets: context });
            })
            .catch (function(err) {
                res.render('home/update', {
                    // Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    stickySnippets: []
                });
            });
});

router.route('/update/:id').post(function(req, res) {
    StickySnippet.findOneAndUpdate({_id: req.params.id}, {value: req.body.value}).exec()
            .then (function() {
                // Redirect to homepage and show a message.
                req.session.flash = {type: 'success', text: 'The sticky snippet was updated successfully.'};
                res.redirect('/');
            })
            .catch (function(err) {
                res.render('home/update', {
                    // Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    stickySnippets: []
                });
            });
});

router.route('/delete/:id').get(function(req, res) {
    StickySnippet.findOneAndRemove({_id: req.params.id}).exec()
            .then (function() {
                // Redirect to homepage and show a message.
                req.session.flash = {type: 'success', text: 'The sticky snippet was removed successfully.'};
                res.redirect('/');
            })
            .catch (function(err) {
                res.redirect('/', {
                    // Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    stickySnippets: []
                });
            });
});

router.route('/register').get(function(req, res) {
    res.render('home/register', {username: undefined, password: undefined});
});

router.route('/register').post(function(req, res, next) {
    // Create a new user.
    let registerUser = new RegisterUser({
        username: req.body.username,
        password: req.body.password
    });

    // Save the user to the database.
    registerUser.save()
        .then(function() {
            // Redirect to homepage and show a message.
            req.session.flash = {type: 'success', text: 'The user was saved successfully. Please login.'};
            res.redirect('/login');
        })
        .catch(function(err) {
            console.log('username ' + err.errors.username);
            console.log('password ' + err.errors.password);
            // If a validation error occurred, view the form and an error message.
            if (err.errors.username !== undefined && err.errors.username.name === 'ValidatorError') {
                // We handle the validation error!
                    return res.render('home/register', {
                        validationErrors: [err.errors.username.message],
                        password: req.body.password,
                        username: req.body.username
                    });
            } else if (err.errors.password !== undefined && err.errors.password.name === 'ValidatorError') {
                return res.render('home/register', {
                    validationErrors: [err.errors.password.message],
                    password: req.body.password,
                    username: req.body.username
                });
            } else if (err.errors.password.name === 'ValidatorError' && err.errors.username.name === 'ValidatorError') {
                // We handle the validation error!
                return res.render('home/register', {
                    validationErrors: [err.errors.username.message, err.errors.password.message],
                    password: req.body.password,
                    username: req.body.username
                });
            } else if (err.errors.password.name === 'CastError' || err.errors.username.name === 'CastError') {
                // If it's a cast error we considers it's a bad request!
                // (Maybe not the smartest thing to do, but WTF, we need to learn
                // what to do if we want to change the status of the response.)
                err.status = 400;
            }
            /*if (err.errors.username.name === 'ValidatorError') {
                // We handle the validation error!
                return res.render('home/register', {
                    validationErrors: [err.errors.username.message],
                    username: req.body.username,
                    password: req.body.password
                });
            } else if (err.errors.username.name === 'CastError') {
                // If it's a cast error we considers it's a bad request!
                // (Maybe not the smartest thing to do, but WTF, we need to learn
                // what to do if we want to change the status of the response.)
                err.status = 400;
            }*/

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

router.route('/login').get(function(req, res) {
    RegisterUser.find({}).exec()
            .then (function(data) {
                // Map the data
                let context = {
                    users: data.map(function(user) {
                        return {
                            username: user.username,
                            password: user.password,
                            id: user.id
                        };
                    })
                };
                return context.users;
            })
            .then (function(context) {
                res.render('home/login', { registerUsers: context });
            })
            .catch (function(err) {
                res.render('home/login', {
                    // Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    registerUsers: []
                });
            });
    //res.render('home/login');
});


module.exports = router;
