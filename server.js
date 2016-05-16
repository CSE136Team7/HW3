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
console.log("redirect user2");
app.get('/home', bookmarks.homePage);

app.post('/bookmarks/star', bookmarks.star);
app.post('/bookmarks/delete', bookmarks.delete);
app.post('/bookmarks/insert', bookmarks.insert);
app.get('/bookmarks/edit', bookmarks.editPage);
app.post('/bookmarks/update', bookmarks.update);
//app.get('/test', bookmarks.getBookmarks);
console.log("redirect user3: "+ app.get('/user1', bookmarks.homePage));
// app.get('/bookmarks/add', bookmarks.add);
// app.get('/bookmarks/edit/:bookmark_id(\\d+)', bookmarks.edit);
// app.get('/bookmarks/confirmdelete/:bookmark_id(\\d+)', bookmarks.confirmdelete);
// app.get('/bookmarks/delete/:bookmark_id(\\d+)', bookmarks.delete);
// app.post('/bookmarks/update/:bookmark_id(\\d+)', bookmarks.update);


app.listen(config.PORT, function () {
  console.log('Example app listening on port ' + config.PORT + '!');
});
