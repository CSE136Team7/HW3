'use strict';
var config = require('./config');
var db = require('./db');
var users = require('./users');
var bookmarks = require('./bookmarks');
var md5 = require('js-md5');

db.init();

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
//this is the options object for express-session
var mySession = session({
  secret: 'T34m7R0ckx',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  name: 'Team7cookiesession',
  proxy: false
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


app.post('/newAccount', users.newAccount);

/*  This must go between the users routes and the bookmarks routes */
app.use(users.auth);

app.get('/home', bookmarks.homePage);

app.post('/bookmarks/star', bookmarks.star);
app.post('/bookmarks/delete', bookmarks.delete);
app.post('/bookmarks/insert', bookmarks.insert);
app.get('/bookmarks/edit', bookmarks.editPage);
app.post('/bookmarks/update', bookmarks.update);
app.post('/bookmarks/clicked', bookmarks.clicked);
app.get('/find', bookmarks.find);

app.listen(config.PORT, function () {
  console.log('Team 7 Bookmarx app listening on port ' + config.PORT + '!');
});
