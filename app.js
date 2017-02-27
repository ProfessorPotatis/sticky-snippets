/**
 * Starting point of the application.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let express = require('express');
 let hbs = require('express-handlebars');
 let bodyParser = require('body-parser');
 let session = require('express-session');

 let mongoose = require('./config/mongoose.js');

 let app = express();
 let port = process.env.PORT || 8000;

 // Connect to database
 mongoose();

 // View engine
 app.engine('.hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
 app.set('view engine', '.hbs');

 // Parsing json data
 app.use(bodyParser.json());

 // Parsing of form data
 app.use(bodyParser.urlencoded({ extended: true }));

 // Static files
 app.use(express.static('public'));

 // Create a session middleware
 app.use(session({
     name:   'sOseCRetOHMygod619caNTbelIEVE3',
     secret: 'yOUbetT3Rbel13vE4721Tb4BYb0y92',
     saveUninitialized: false,
     resave: false
 }));

 // Flash messages - survives only a round trip.
 app.use(function(req, res, next) {
     res.locals.flash = req.session.flash;
     delete req.session.flash;

     next();
 });

 // Routes
 app.use('/', require('./routes/router.js'));

 //Errors
 app.use(function(req, res) {
     res.status(404).render('error/404');
 });

 app.use(function(err, req, res, next) {
    if (err.status !== 400) {
        return next(err);
    }
    console.error(err.stack);
    res.status(400).render('This is a 400.');
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
