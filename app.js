/**
 * Starting point of the application.
 *
 * @author ProfessorPotatis
 * @version 1.0.0
 */

 'use strict';

 let express = require('express');
 let app = express();

 // Routes
 app.use('/', require('./routes/router.js'));

 app.listen(3000, function () {
     console.log('Example app listening on port 3000!');
 });
