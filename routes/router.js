/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();

router.route('/').get(function(req, res) {
    res.render('home/index');
});

router.route('/create').get(function(req, res) {
    res.render('home/create');
});

router.route('/register').get(function(req, res) {
    res.render('home/register');
});

router.route('/login').get(function(req, res) {
    res.render('home/login');
});


module.exports = router;
