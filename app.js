/**
 * Starting point of the application.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let express = require('express');
 //let csrf = require('csurf');
 let helmet = require('helmet');
 let hbs = require('express-secure-handlebars');
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
 app.use(bodyParser.urlencoded({ extended: false }));

 // Static files
 app.use(express.static('public'));

 // Protection against XSS
 app.use(helmet({
     xssFilter: false // Already implemented express-secure-handlebars
 }));
 app.use(helmet.contentSecurityPolicy({
     directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'"],
         scriptSrc: ["'self'"]
     }
 }));

 // Create a session middleware
 app.use(session({
     name:   'sOseCRetOHMygod619caNTbelIEVE3',
     secret: 'yOUbetT3Rbel13vE4721Tb4BYb0y92',
     saveUninitialized: false,
     resave: false
 }));

 // Protection against CSRF
 //let csrfProtection = csrf({cookie: false});

 // Flash messages - survives only a round trip.
 // Using Mats Loocks Pure Approval flash.
 app.use(function(req, res, next) {
     res.locals.flash = req.session.flash;
     delete req.session.flash;

     next();
 });

 // Use router module
 app.use('/', require('./routes/router.js'));

 // Errors
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
