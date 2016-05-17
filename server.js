'use strict';
var config = require('./config');
var db = require('./db');
var users = require('./users');
var bookmarks = require('./bookmarks');
var md5 = require('js-md5');
var debug = require('./debug');

db.init();

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

//this is the object for express-mysql-session
var sessionStore = new MySQLStore ({
  checkExpirationInterval: 15 * 60 * 1000, //15 minutes (900000 milliseconds)
  expiration: 24 * 60 * 60 * 1000, //24 hours (86400000 milliseconds)
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
},
    db.connection
);

//this is the options object for express-session
var mySession = session({
  secret: config.SECRET,
  resave: true,
  sessionStore: MySQLStore, //uses above store object
  saveUninitialized: true,
  cookie: { secure: false },
  name: 'BookmarxTeam7',
  proxy: false
});



var app = express();

/* turn off header */
//app.disable('x-powered-by');
/* alternatively: */
function customHeaders( req, res, next ){
  // Switch off the default 'X-Powered-By: Express' header
  app.disable( 'x-powered-by' );
  // OR set your own header here
  res.setHeader( 'App-Powered-By', 'Blood, sweat, and tears' );
  // .. other headers here
  next()
}
app.use( customHeaders );

/* Sessioning (express-session) */
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

/* Set up cookie information */
//cookie test
/*app.get('/', function initViewsCount(req, res, next) {
  if (typeof req.session.views === 'undefined') {
    req.session.views = 1;
    return res.end('Welcome to the file session demo. Refresh page!');
  }
  return next();
});
app.get('/', function incrementViewsCount(req, res, next) {
  console.assert(typeof req.session.views === 'number',
      'missing views count in the session', req.session);
  req.session.views++;
  return next();
});*/
app.use(function printSession(req, res, next) {
  debug.print2('req.session: ', req.session);
  return next();
});
/*
app.get('/', function sendPageWithCounter(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.write('<p>views: ' + req.session.views + '</p>\n');
  res.end();
});*/
//Try it yo'self
//app.get('login')

/* Stop the annoying cannot GET / */
app.get('/', function (req, res) {
  res.send('<h1>404 Not Found</h1><br><p>Please navigate to <a href="login">/login</a></p>');
  debug.print('404 Error: user tried to access /');

});

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

app.listen(config.PORT, function () {
  console.log('Team 7 Bookmarx app listening on port ' + config.PORT + '!');
});
