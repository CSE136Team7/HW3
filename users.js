/*  This file is a stub for a full blown user management system.
 Values are hard coded for example purposes
 */

 var config = require('./config');
 var db = require('./db');
 var md5 = require('js-md5');
 var debug = require('./debug');

/**
 *
 * Attempt to login the user.  Redirect to /books on successful login and /login on unsuccessful attempt.
 */

 module.exports.login = function(req, res) {
  if (req.body.username!="" && req.body.password!=""){
      if (typeof req.session.user_ID === 'undefined') {

      }
    //Fetch the login fields
    var userInput = req.body.username;
    var pwdInput = req.body.password;
    var pwdInputCrypted = md5(pwdInput, userInput);
    //Look into the data base if there is a login matching the input
    var sql = 'SELECT username, passhash, user_ID FROM users WHERE username = ' + db.escape(userInput);
    db.query(sql, function(err, results) {
      if(err){
          res.redirect('/login?error=There was a problem logging in. Please try again.');
      }
      else{
          if(results.length>0){

            // debug.print('retrieved username:'+results[0].username+' and hash:'+results[0].passhash+' from db');
            // debug.print('matching with username:'+userInput+' and hash:'+pwdInputCrypted+' from user');

            if (userInput===results[0].username && pwdInputCrypted===results[0].passhash) {
                if (typeof req.session.user_ID === 'undefined') {
                    req.session.user_ID = results[0].user_ID;
                    res.redirect('/views');
                }
                else {
                    debug.print('info: There was already a user field in cookie session, user was not logged out properly');
                    debug.print('info: Logging in user anyway');
                    req.session.user_ID = results[0].user_ID;
                    res.redirect('/views');
                }
            }
            else{
              res.redirect('/login?error=Your username or password are incorrect. Please try again!');
            }
          }
          else{
            res.redirect('/login?error=The query has an empty result!');
          }
        }
      });
}
else{
    //Alert message : all the fields have not been filled
    res.redirect('/login?error=The login form was not filled up properly! Please try again!');
  }
};

/**
 * Render the login form
 */
 module.exports.loginForm = function(req, res){
     /*if (typeof req.session.user === 'undefined') {}
     else {
         req.session.destroy();
     }*/
     if(req.query.error) {
      var error = req.query.error;
      res.render('users/login', {errormsg : error});
     }
      else {
     res.render('users/login', { errormsg : "" });
   }
};



/**
 * Clear out the session to logout the user
 */
 module.exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/home');
};

/**
 * Verify a user is logged in.  This middleware will be called before every request to the books directory.
 */
 module.exports.auth = function(req, res, next) {
  if (req.session ) {
    return next();
  }
  else {
    res.redirect('/login');
  }
};





module.exports.signup = function(req, res){
  if(req.query.error) {
    var error = req.query.error;
    res.render('users/signup', {errormsg : error});
  }
  else {
   res.render('users/signup', { errormsg : "" });
 }
}

module.exports.newAccount = function(req, res){

  if (req.body.username != "" && req.body.password != "" ){
    var user = db.escape(req.body.username);
    var pwd = db.escape(req.body.password);


    var sql = 'SELECT username FROM users WHERE username = ' + user;
    db.query(sql, function(err, results) {
      if(err){
          res.redirect('/login?error=Account creation is temporarily down. Please try again later');
      }
      else{
          if (results.length==0){
              //no existing username --> insert into the table
              //hashing of the password
              debug.print('user and pw entered: '+user+pwd);
              var pwdCrypted = db.escape(md5(pwd, user));
              var queryString = "INSERT INTO users(username, passhash) VALUES ("+ user + "," + pwdCrypted +")";
              db.query(queryString, function(err, result){
                  if (err){
                      debug.print('error: new account: could not insert new account');
                      res.redirect('/signup?error=There was a problem with the account creation. Try again.');
                    }
                else{
                    //render an alert message : the account have been created
                    //res.render('users/login');
                    //Look into the data base to get the user_ID needed for sessioning
                    var sql = 'SELECT user_ID FROM users WHERE username = ' + user;
                    db.query(sql, function(err, results) {
                        if(err){
                            debug.print('error: new account: could not retrieve user_ID of new account');
                            res.redirect('/signup?error=There was a problem with the account creation. Try again.');
                        }
                        else{
                            if(results.length>0){
                                debug.print("info: account creation: redirect to: views");
                                if (typeof req.session.user_ID === 'undefined') {
                                    debug.print('attempting to set session');
                                    req.session.user_ID = results[0].user_ID;
                                    res.redirect('/views');
                                }
                            }
                            else{
                                res.redirect('/login?error=Your account was unable to be automatically added to our records!');
                                debug.print('log: error on account creation and autolog, empty input');
                            }
                        }
                    });

                }
              });
          }
          else{
            //already existing username --> alert message
            res.redirect('/signup?error=This username is already taken. Try another one! ');
          }
        }
      });
}
else{
  res.redirect('/signup?error=The form was not filled up properly! Please try again!');
}
};

module.exports.resetpw = function(req, res){
    if(req.query.error) {
        var error = req.query.error;
        res.render('users/resetpw', {errormsg : error});
    }
    else {
        res.render('users/resetpw', { errormsg : "" });
    }
}

module.exports.doReset = function(req, res) {
    if (req.body.username != "" && req.body.passwordOld != "" && req.body.passwordNew != "") {
        var user = db.escape(req.body.username);
        var pwdoldhash = db.escape(md5(req.body.passwordOld, user));
        var pwdnewhash = db.escape(md5(req.body.passwordNew, user));

        if (req.body.passwordOld == req.body.passwordNew) {
            debug.print('info: resetpw: user tried to enter the same data for old and new password');
            res.redirect('/resetpw?error=Old and new password must not match');
            return;
        }

        var sql = 'SELECT username, passhash, user_ID FROM users WHERE username=' + user + ' AND passhash=' + pwdoldhash;
        db.query(sql, function (err, results) {
            if (err) {
                debug.print('ERROR: db query failed on retrieve username');
                res.redirect('/resetpw?error=Please enter the correct username and password with a unique new password');
            }
            else {
                if (results.length == 0) {
                    //no user name exists --> error message
                    //render an alert : the account does not exist
                    res.redirect('/resetpw?error=The username and password did not match our records. Try again!');
                }
                else {
                    if (typeof req.session.user_ID === 'undefined') {
                        debug.print('info: reset pw: init session for user');
                        req.session.user_ID = results[0].user_ID;
                    }
                    //var resUser = results[0].username, resPwd = results[0].passhash, resID = results[0].user_ID;
                    var queryString = 'UPDATE users SET passhash=' + pwdnewhash + ' WHERE username=' + user;
                    db.query(queryString, function (err, results) {
                        if (err) {
                            debug.print('info: resetpw query: '+queryString);
                            debug.print('info: update passhash failed:'+req.body.passwordNew+'::'+pwdnewhash);
                            res.redirect('/resetpw?error=Unable to save new password');
                        }
                        else {
                            if  (typeof req.session.user_ID != 'undefined') {
                                debug.print('info: reset pw: able to cache user earlier and redirect to home');
                                res.redirect('/views');
                            }
                            else {
                                debug.print('info: resetpw: worked but redirect and cookie session failed');
                                res.redirect('/login?error=Unable to automatically log in after reset password. Please log in.');
                            }
                        }
                    })

                }
            }
        })
    }
    else {
        res.redirect('/resetpw?error=The form was not filled up properly! Please try again!');
    }
};

