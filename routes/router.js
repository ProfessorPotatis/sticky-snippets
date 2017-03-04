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
let csrf = require('csurf');

// Protection against CSRF attacks
let csrfProtection = csrf();

// Session variable
let sess;

// Middleware for authentication
let isAuthenticated = function(req, res, next) {
    let sess = req.session;

    // If not authenticated trigger a 403 error.
    if (!sess.username) {
        return res.status(403).render('error/403');
    }
    next();
};

/* Finding and presenting stickySnippets on firstpage */
router.route('/').get(function(req, res, next) {
    /* Empty the database of stickySnippets and registered users */
    /*StickySnippet.remove({}, function(err) {
       console.log('All stickySnippets removed.');
    });*/
    /*RegisterUser.remove({}, function(err) {
        console.log('All registered users removed.');
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
                next(err);
            });
});

/* If authenticated, show create page for stickySnippet. Use csrfToken. */
router.route('/snippet/create').get(isAuthenticated, csrfProtection, function(req, res) {
    res.render('home/create', ({value: undefined}, {csrfToken: req.csrfToken()}));
});

/* If authenticated and the csrfToken is valid, post stickySnippet to firstpage. */
router.route('/snippet/create').post(isAuthenticated, csrfProtection, function(req, res, next) {
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
            // Using Mats Loocks Pure Approval flash.
            if (err.errors.value.name === 'ValidatorError') {
                // We handle the validation error!
                return res.render('home/create', {
                    validationErrors: [err.errors.value.message],
                    value: req.body.value
                });
            }

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

/* If authenticated, show update page for specific stickySnippet. Use csrfToken. */
router.route('/snippet/update/:id').get(isAuthenticated, csrfProtection, function(req, res, next) {
    StickySnippet.find({_id: req.params.id}).exec()
            .then (function(data) {
                // Map the data and include csrfToken
                let context = {
                    snippets: data.map(function(snippet) {
                        return {
                            value: snippet.value,
                            createdAt: snippet.createdAt,
                            id: snippet.id,
                            csrfToken: req.csrfToken()
                        };
                    })
                };
                return context.snippets;
            })
            .then (function(context) {
                res.render('home/update', ({stickySnippets: context}));
            })
            .catch (function(err) {
                res.render('home/update', {
                    // Use the flash partial to view the error message.
                    flash: {type: 'danger', text: err.message},
                    stickySnippets: []
                });
                next(err);
            });
});

/* If authenticated and the csrfToken is valid, post updated stickySnippet to firstpage. */
router.route('/snippet/update/:id').post(isAuthenticated, csrfProtection, function(req, res, next) {
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
                next(err);
            });
});

/* If authenticated, delete specific stickySnippet. */
router.route('/snippet/delete/:id').get(isAuthenticated, function(req, res, next) {
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
                next();
            });
});

/* Show register page and include csrfToken. */
router.route('/register').get(csrfProtection, function(req, res) {
    res.render('home/register', ({username: undefined, password: undefined}, {csrfToken: req.csrfToken()}));
});

/* If csrfToken is valid save new user to database. */
router.route('/register').post(csrfProtection, function(req, res, next) {
    // Create a new user.
    let registerUser = new RegisterUser({
        username: req.body.username,
        password: req.body.password
    });

    // Save the user to the database.
    registerUser.save()
        .then(function() {
            // Redirect to login and show a message.
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
            }

            // Let the middleware handle any errors but ValidatorErrors.
            next(err);
        });
});

/* Show login page and include csrfToken. Set session. */
router.route('/login').get(csrfProtection, function(req, res) {
    sess = req.session;
    // If logged in redirect to admin page, else show login page.
    if (sess.username) {
        res.redirect('/admin');
    } else {
        res.render('home/login', ({username: undefined, password: undefined}, {csrfToken: req.csrfToken()}));
    }
});

/* If csrfToken is valid, user exist and password is correct: log in user. */
router.route('/login').post(csrfProtection, function(req, res, next) {
    sess = req.session;
    // Look for user in database.
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
                        validationErrors: ['Wrong password. Try again.'],
                        username: req.body.username
                    });
                }
            };

            // Compare password to password in database.
            data.comparePassword(req.body.password, result);
        })
        .catch(function(err) {
            if (TypeError) {
                return res.render('home/login', {
                    validationErrors: ['That user does not exist. Please register.']
                });
            }
            next(err);
        });

});

/* If authenticated, show admin page. */
router.route('/admin').get(isAuthenticated, function(req, res) {
    res.render('home/admin');
});

/* Show logged out page. */
router.route('/out').get(function(req, res) {
    res.render('home/logout');
});

/* If authenticated, destroy session and redirect to logged out page. */
router.route('/logout').get(isAuthenticated, function(req, res) {
    sess = req.session;
    if (sess.username) {
        // LOG OUT!
        req.session.destroy();
        res.redirect('/out');
    }
});

// Export the module
module.exports = router;
