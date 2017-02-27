/**
 * Module for router.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

'use strict';

const router = require('express').Router();

router.route('/').get(function(req, res) {
    res.send('Hello World!');
});


module.exports = router;
