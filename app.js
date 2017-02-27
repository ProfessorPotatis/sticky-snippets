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

 // View engine
 app.engine('.hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
 app.set('view engine', '.hbs');

 // Static files
 app.use(express.static('public'));

 // Routes
 app.use('/', require('./routes/router.js'));

 app.listen(8000, function () {
     console.log('Example app listening on port 8000!');
 });
