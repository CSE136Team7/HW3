/*  This file is a stub for a full blown user management system.
 Values are hard coded for example purposes
 */

var config = require('./config');
var db = require('./db');

/**
 *
 * Attempt to login the user.  Redirect to /books on successful login and /login on unsuccessful attempt.
 */
module.exports.login = function(req, res) {
  if (req.body.username === config.USERNAME && req.body.password === config.PASSWORD) {
    req.session.user = req.body.username;
    // Needs to be changed to be specific to the user that is logged in
    console.log("redirect user1");
    res.redirect('/user1');
  }
  else{
    res.redirect('/login');
  }
};

/**
 * Render the login form
 */
module.exports.loginForm = function(req, res){
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
  if (req.session && req.session.user === config.USERNAME) {
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

    //Look into the data base if there is a login matching the input
    // var sql = 'SELECT username FROM users WHERE username = ' + user;
    // db.query(sql, function(err, results) {
    //   if(err){
    //     throw(err);
    //   }
    //   else{
    //       if (results.length==0){
            //no existing username --> insert into the table
               //hashing of the password   
              var queryString = 'INSERT INTO users(username, passhash) VALUES (' + user +','+ pwd  + ')';
              db.query(queryString, function(err, result){ 
                if (err)
                    throw err;
                     });
  //               else{
  //                   //render an alert message : the account have been created
  //                   res.render('users/success');
  //               }
  //             });
  //         }
  //         else{
  //           //already existing username --> alert message
  //           res.render('users/errorNew');
  //         }
  //     }
  //   });
  // }
  // else{
  //   res.render('users/errorBadForm');
  }
 };
