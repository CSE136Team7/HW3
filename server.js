'use strict';
var config = require('./config');
var db = require('./db');
var users = require('./users');
var bookmarks = require('./bookmarks');

db.init();

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mySession = session({
  secret: 'N0deJS1sAw3some',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
});

var app = express();
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
app.get('/logout', users.logout);

/*  This must go between the users routes and the bookmarks routes */
app.use(users.auth);
app.get('/bookmarks',bookmarks.list);
// console.log("I made it here1");
// app.get('/bookmarks/add', bookmarks.add);
// console.log("I made it here2");
// app.get('/bookmarks/edit/:bookmark_id(\\d+)', bookmarks.edit);
// console.log("I made it here3");
// app.get('/bookmarks/confirmdelete/:bookmark_id(\\d+)', bookmarks.confirmdelete);
// console.log("I made it here4");
// app.get('/bookmarks/delete/:bookmark_id(\\d+)', bookmarks.delete);
// console.log("I made it here5");
// app.post('/bookmarks/update/:bookmark_id(\\d+)', bookmarks.update);
// console.log("I made it here6");
// app.post('/bookmarks/insert', bookmarks.insert);
// console.log("I made it here7");

app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
