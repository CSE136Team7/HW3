var config = require('./config');
var db = require('./db');
var debug = require('./debug');
var async = require('async');
var utility = require('./utility');
var xlsx = require('node-xlsx');


module.exports.createFolder=function(req, res) {
  //  console.log("req.body.folder: "+JSON.stringify(req.body,null,4));
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
  }
  if (req.body.folder != ""){
    user = req.session.user_ID;
    var folderName = db.escape(req.body.folder);
    var queryString = 'INSERT INTO folders (Name, user_ID) VALUES ('
        + folderName + ',' + user + ')';
    db.query(queryString, function(err) {
  		if (err) {throw err;}
  		res.redirect('/home');
  	});
  } else{
    res.redirect('/home?error=The form was not filled properly');
  }
}
