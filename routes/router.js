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

let sess;

let isAuthenticated = function(req, res, next) {
    let sess = req.session;

    // If not authenticated trigger a 403 error.
    if (!sess.username) {
        return res.status(403).render('error/403');
    }
    next();
};

router.route('/').get(function(req, res) {
    /*StickySnippet.remove({}, function(err) {
   console.log('collection removed');
});*/
/*RegisterUser.remove({}, function(err) {
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

router.route('/snippet/create').get(isAuthenticated, function(req, res) {
    res.render('home/create', {value: undefined});
});

router.route('/snippet/create').post(isAuthenticated, function(req, res) {
    // Create a new stickySnippet.
    let stickySnippet = new StickySnippet({
        value: req.body.value
    });
    console.log(stickySnippet);

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
                err.status = 400;
            }

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

router.route('/snippet/update/:id').get(isAuthenticated, function(req, res) {
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

router.route('/snippet/update/:id').post(isAuthenticated, function(req, res) {
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

router.route('/snippet/delete/:id').get(isAuthenticated, function(req, res) {
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
                return res.render('home/register', {
                    validationErrors: [err.errors.username.message, err.errors.password.message],
                    password: req.body.password,
                    username: req.body.username
                });
            } else if (err.errors.password.name === 'CastError' || err.errors.username.name === 'CastError') {
                // If it's a cast error we considers it's a bad request!
                err.status = 400;
            }
            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

router.route('/login').get(function(req, res) {
    res.render('home/login', {username: undefined, password: undefined});
});

router.route('/login').post(function(req, res, next) {
    sess = req.session;
    RegisterUser.findOne({username: req.body.username}).exec()
        .then(function(data) {
            let result = function(err, match) {
                if (err) {
                    next(err);
                }

                if (match) {
                    sess.username = req.body.username;
                    res.redirect('/admin');
                } else {
                    return res.render('home/login', {
                        validationErrors: ['Wrong password. Try again.']
                    });
                }
            };
            data.comparePassword(req.body.password, result);
        })
        .catch(function(err) {
            console.log(err);
            if (TypeError) {
                return res.render('home/login', {
                    validationErrors: ['That user does not exist. Please register.']
                });
            }
            next(err);
        });

});

router.route('/admin').get(isAuthenticated, function(req, res) {
    res.render('home/admin');
});


module.exports = router;
