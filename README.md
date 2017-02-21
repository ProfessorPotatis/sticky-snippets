##Examination 2 - Sticky Snippets

In this assignment, you will create a web application for persistent handling of [snippets](https://en.wikipedia.org/wiki/Snippet_(programming)) using an application framework and an object data modeling library for MongoDB.

##Requirements

The application in [Node.js](https://nodejs.org/en/) will use [Express.js](http://expressjs.com/) as the application  framework and [Mongoose](http://mongoosejs.com/) as  the object modeling library. The application must have full CRUD functionality regarding snippets, whereby a user must be able to create, read, update and delete snippets.

Users must be able to register themselves and must be able to login to the application after entering a user ID and a password. A user cannot register an already existing user ID as user ID is unique for the application. A user must be able to log off from the application it has already logged on to.

Anonymous users will only be able to view snippets. Authenticated users, in addition to view, must also be able to create, edit and delete snippets.  Because of this the application must support some basic authentication and authorization. Only use of the session store, using the [express-session](https://github.com/expressjs/session) module, is allowed for implementation of authentication and authorization. You must not use any modules like Passport, etc., to authenticate or authorize.

If a user tries to access a resource which requires the user to be logged in, the application must return the status code 403 (forbidden). Of course, when necessary, the application must also return the status code 404 (not found) as well as 500 (internal error).

As far as posssible, the application must be protected from vulnerable attacks.

##Setup 

It is otional to use our vagrants but if you want follow the below steps.

1. Clone your examination repository: `git clone https://github.com/1dv023/<USERNAME>-examination-2`
2. Pull the [node-mongodb-vagrant](https://github.com/1dv023/node-mongodb-vagrant) into the repository: `git pull https://github.com/1dv023/node-mongodb-vagrant.git`
3. Pull and merge the [javascript-style-guide](https://github.com/CS-LNU-Learning-Objects/javascript-style-guide) into the repository: `git pull https://github.com/CS-LNU-Learning-Objects/javascript-style-guide`. (Or write your own style guide files.)
4. Run the following from your terminal: `vagrant up`.
5. SSH into the machine: `vagrant ssh`.

## Extra features [optional]
For those who wants to expand functionality in the application beyond the standard requirements for passing this assignment (see above) feel free to do that- Some examples of this could be:
* Add support for [tagging](https://en.wikipedia.org/wiki/Tag_(metadata)) each snippet by one or more tags
* Add support for just showing snippets thats belongs to one tag
