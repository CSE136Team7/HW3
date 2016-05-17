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
        throw(err);
      }
      else{
          if(results.length>0){

            //debug.print(results[0].username);
            //debug.print(results[0].passhash);
            //debug.print(userInput);
            //debug.print(pwdInputCrypted);
              debug.print(results[0].user_ID);
            if (userInput===results[0].username && pwdInputCrypted===results[0].passhash) {
                if (typeof req.session.user_ID === 'undefined') {
                    req.session.user_ID = results[0].user_ID;
                    res.redirect('/home');
                }
                else {
                    debug.print('There was already a user field in cookie session, they were not logged out properly');
                    debug.print('Logging them in anyway');
                    req.session.user_ID = results[0].user_ID;
                    res.redirect('/home');
                }
            }
            else{
              res.render('users/errorBadLogin');
            }
          }
          else{
            res.render('users/errorDB');
          }
      }
    });

  }
  else{
    //Alert message : all the fields have not been filled
    res.render('users/errorBadForm');
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
     res.render('users/login');
};



/**
 * Clear out the session to logout the user
 */
 module.exports.logout = function(req, res) {
  req.session.destroy();
  res.redirect('/login');
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











module.exports.newAccount = function(req, res){

  if (req.body.username != "" && req.body.password != "" ){
    var user = req.body.username;
    var pwd = req.body.password;

    
    var sql = 'SELECT username FROM users WHERE username = ' + db.escape(user);
    db.query(sql, function(err, results) {
      if(err){
        throw(err);
      }
      else{
        if (results.length==0){
            //no existing username --> insert into the table
               //hashing of the password   
               var pwdCrypted = md5(pwd, user);  
               var queryString = "INSERT INTO users(username, passhash) VALUES ("+ db.escape(user) + "," + db.escape(pwdCrypted) +")";
               db.query(queryString, function(err, result){
                if (err){
                   throw err;
                }
                else{
                    //render an alert message : the account have been created
                    res.render('users/login');
                }
              });
          }
          else{
            //already existing username --> alert message
            res.render('users/errorNew');
          }
      }
    });
  }
  else{
    res.render('users/errorBadForm');
  }
 };