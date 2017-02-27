/**
 * Starting point of the application.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let express = require('express');
 let hbs = require('express-handlebars');

 let app = express();
 let port = process.env.PORT || 8000;

 // View engine
 app.engine('.hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
 app.set('view engine', '.hbs');

 // Static files
 app.use(express.static('public'));

 // Routes
 app.use('/', require('./routes/router.js'));

 //Errors
 app.use(function(req, res) {
     res.status(404).render('error/404');
 });

 app.use(function(err, req, res, next) {
    if (err.status !== 403) {
        return next(err);
    }
    console.error(err.stack);
    res.status(403).render('error/403');
 });

 app.use(function(err, req, res) {
    console.error(err.stack);
    res.status(500).render('error/500');
 });

 // Start listening
 app.listen(port, function () {
     console.log('Application listening on port ' + port + '.');
 });
