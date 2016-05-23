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



module.exports.deleteFolder = function(req, res) {
    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {
      //throw err
      // go to login
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
    }
    //else
    user_ID = db.escape(req.session.user_ID);

    // Do validation on book_ID && user_ID
    if (req.body.folder_ID && user_ID) {
      // get userid and book_ID
      var folder_ID = db.escape(req.body.folder_ID);
      //var user_ID = db.escape(req.body.user_ID);
    } else {
      throw new Error('book_ID or user_ID is null/invalid.');
    }
    // console.log("folder_ID: "+ JSON.stringify(req.body,null,4)+ " ");
    var sql = "DELETE FROM folders WHERE user_ID=" + user_ID +
      " AND folder_ID=" + folder_ID + ";";

    db.query(sql, function(err) {
      if (err) {
        res.redirect('/home?error=Could not delete folder.');
      } else {
        res.redirect('/home');
      }
    });
  }




  module.exports.addBookToFolder = function(req, res) {
    console.log("book_ID:----> "+JSON.stringify(req.body,null,4));
    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {
      //throw err
      // go to login
      debug.print('Warning: user tried to insert a bookmark without a user_ID');
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
    }
    //else
    user_ID = db.escape(req.session.user_ID);

   	if (req.body.user_ID != ""
   		&& req.body.folder_ID != ""
      && req.body.book_ID != ""
      && typeof(req.body.book_ID) != 'undefined'){


   	    var folder_ID = db.escape(req.body.folder_ID);
        var book_ID = db.escape(req.body.book_ID);
        console.log("req.body: ----------->"+JSON.stringify(req.body,null,4)+"req.body.folder_ID: "+req.body.folder_ID);
        var queryString = 'INSERT INTO folder_has_books (folder_ID, book_ID) VALUES ('
            + folder_ID + ','  + book_ID + ')';


        db.query(queryString, function(err) {
            if (err) {
                debug.print("Query failed err:" + err);
                throw(err);
            }
            else {
                res.redirect('/home');
            }
        });
      }

   else{
   	if (req.body.folder == "" || req.body.folder_ID == ""  ||req.body.book_ID=="") {
   		res.redirect('/home?error=Form is not filled correctly');

   	}
   }
  }
