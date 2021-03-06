'use strict';
var config = require('./config');
var db = require('./db');
var users = require('./users');
var bookmarks = require('./bookmarks');
var md5 = require('js-md5');
var debug = require('./debug');
var folders = require('./folders');

db.init();
debug.print("Server starting");

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var multer = require('multer');

//this is the object for express-mysql-session
var sessionStore = new MySQLStore ({
      checkExpirationInterval: 15 * 60 * 1000, //15 minutes (900000 milliseconds)
      expiration: 24 * 60 * 60 * 1000, //24 hours (86400000 milliseconds)
      createDatabaseTable: true,
      schema: {
        tableName: 'sessions',
        columnNames: {
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
  sessionStore: sessionStore, //uses above store object
  saveUninitialized: true,
  cookie: { secure: false },
  name: 'BookmarxTeam7',
  proxy: false
});

//filesystem to write to file for logging
var fs = require('fs');

var app = express();

/* turn off header */
//app.disable('x-powered-by');
/* alternatively: */
function customHeaders( req, res, next ){
  // Switch off the default 'X-Powered-By: Express' header
  app.disable( 'x-powered-by' );
  // OR set your own header here
  //res.setHeader( 'App-Powered-By', 'Blood, sweat, and tears' );
  next()
}
app.use( customHeaders );

/* Sessioning (express-session) */
app.use(mySession);

/*  Not overwriting default views directory of 'views' */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({dest:'./uploads/'}).single('myFile'));

/* Set up cookie information */
//cookie test
app.use(function printSession(req, res, next) {
  // debug.print2('req.session: ', req.session);
  return next();
});

var checkJS = function (req, res, next) {

  if(req.body.javascript && req.body.javascript === "0" || req.query.js === "0") {
    debug.print('Warning: User has JavaScript disabled.');
    req.session.js = false;
  }
  else if(req.body.javascript && req.body.javascript === "1" || req.query.js === "1"){
    req.session.js = true;
  }

  if(!req.session.js){
    req.session.js = false;
  }
  console.log("info: javascript is " + (req.session.js ? 'On' : 'Off'));
  //console.log(req.body);
  return next();
}

app.use( checkJS );

/* Stop the annoying cannot GET / */
app.get('/', function (req, res) {
  //res.send('<h1>404 Not Found</h1><br><p>You are being redirected to <a href="login">/login</a></p>');

  debug.print('Error: user tried to access /');
  res.redirect('/login');
  // res.send('<h1>404 Not Found</h1><br><p>You are being redirected to <a href="login">/login</a></p>');
  //
  // debug.print('404 Error: user tried to access /');
  //next();
});


/* Routes - consider putting in routes.js */
app.get('/login', users.loginForm);
app.post('/login', users.login);
app.get('/logout', users.logout);


app.post('/newAccount', users.newAccount);
app.post('/doReset', users.doReset);
app.post('/doForgot', users.doForgot);

app.get('/signup', users.signup);
app.get('/resetpw', users.resetpw);
app.get('/forgotpw', users.forgotpw);

/*  This must go between the users routes and the bookmarks routes */
app.use(users.auth);

app.get('/home', bookmarks.homePage);
app.get('/showAll', bookmarks.homePage);

app.get('/bookmarks/getbooks', bookmarks.getbooks);
app.get('/bookmarks/getfolders', bookmarks.getfolders);

app.post('/bookmarks/star', bookmarks.star);
app.post('/bookmarks/delete', bookmarks.delete);
app.post('/bookmarks/insert', bookmarks.insert);
app.get('/bookmarks/edit', bookmarks.editPage);
app.post('/bookmarks/update', bookmarks.update);
app.post('/bookmarks/clicked', bookmarks.clicked);
app.get('/bookmarks/sortBooks', bookmarks.sortBooks);
app.get('/folder/starred', bookmarks.starredPage);
app.post('/createFolder', folders.createFolder);
app.post('/deleteFolder', folders.deleteFolder);
app.post('/addBookToFolder', folders.addBookToFolder);
app.post('/bookmarks/import', bookmarks.import);
app.get('/bookmarks/export', bookmarks.export);


app.get('/folders', bookmarks.folders);
app.get('/find', bookmarks.find);

app.listen(config.PORT, function () {
  console.log('Team 7 Bookmarx app listening on port ' + config.PORT + '!');
});

app.get('/admin', function (req, res, next) {
  var user = req.session.user_ID;
  if (user === 'undefined')
    user = 'unsub';
  debug.print('Error: user '+user+' tried to access admin');
  req.session.destroy();
  res.redirect('/login');
  return next();
});
app.get('/robot', function (req, res, next) {
  var user = req.session.user_ID;
  if (user === 'undefined')
    user = 'unsub';
  debug.print('Error: user '+user+' tried to access robot');
  req.session.destroy();
  res.redirect('/login');
  return next();
});
app.get('/root', function (req, res, next) {
  var user = req.session.user_ID;
  if (user === 'undefined')
    user = 'unsub';
  debug.print('user '+user+' tried to access root');
  req.session.destroy();
  res.redirect('/login');
  return next();
});
app.get('/*', function (req, res, next) {
  var user = req.session.user_ID;
  if (user === 'undefined')
    user = 'unsub';
  //debug.print('Info: user '+user+' tried to access unknown path');
  res.send('<h1>404 Not Found</h1><br><p>Please use the browser\'s back button.</p>');

//  req.session.destroy();
//  res.redirect('/login');
  return next();
});
