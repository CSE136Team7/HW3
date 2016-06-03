var config = require('./config');
var db = require('./db');
var debug = require('./debug');
var async = require('async');
var utility = require('./utility');



module.exports.createFolder=function(req, res) {
  var user;
  if (typeof req.session.user_ID === 'undefined') {
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login?error=You are not logged in');
  }
  if (req.body.folder != ""){
    user = req.session.user_ID;
    var folderName = db.escape(req.body.folder);
    var queryString = 'INSERT INTO folders (Name, user_ID) VALUES ('
        + folderName + ',' + user + ')';
    db.query(queryString, function(err) {
      if (err) {
          debug.print("ERROR: Query failed err:" + err);
          throw(err);
      }else {
          if(!req.session.js){ // server render
              res.redirect('/home?error=Added ' + folderName + ' to your folders!');
          } else{ // client render
            res.json({});
          }
      }
    });
  } else{
    if(!req.session.js){ // server render
        res.redirect('/home?error=The form was not filled properly');
    } else{ // client render
      res.json({"error": "The form was not filled properly."});
    }
  }
}




module.exports.deleteFolder = function(req, res) {
    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
    }

    user_ID = db.escape(req.session.user_ID);

    if (req.body.folder_ID && user_ID) {
      // get userid and book_ID
      console.log("req.body.folder_ID: ======>"+req.body.folder_ID);
      var folder_ID = db.escape(req.body.folder_ID);
      //var user_ID = db.escape(req.body.user_ID);
    } else {
      throw new Error('book_ID or user_ID is null/invalid.');
    }
    var sql = "DELETE FROM folders WHERE user_ID=" + user_ID +
      " AND folder_ID=" + folder_ID + ";";

    db.query(sql, function(err) {
      if (err) {
        if(!req.session.js){ // server render
            res.redirect('/home?error=Could not delete folder.');
        } else{ // client render
          res.json({"error": "Could not delete folder."});
        }
      } else {
        if(!req.session.js){ // server render
          res.redirect('/home?error=Deleted folder from your folders!');
        } else{ // client render
          res.json({});
        }

        // res.redirect('/home');
      }
    });
  }




  module.exports.addBookToFolder = function(req, res) {
    debug.print('Received request for addBookToFolder.');
    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {

      debug.print('Warning: user tried to insert a bookmark without a user_ID');
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
      return;
    }
    //else
    user_ID = db.escape(req.session.user_ID);

   	if (req.body.user_ID != ""
      && req.body.folder != ""
   		&& req.body.folder_ID != ""
      && req.body.book_ID != ""
      && typeof(req.body.book_ID) != 'undefined'){

        var folderName = db.escape(req.body.folder);
   	    var folder_ID = db.escape(req.body.folder_ID);
        var book_ID = db.escape(req.body.book_ID);
        var queryString = 'INSERT INTO folder_has_books (folder_ID, book_ID) VALUES ('
            + folder_ID + ','  + book_ID + ')';

        var updateFolderName = 'UPDATE folders SET Name=' + folderName + ' WHERE folder_ID=' + folder_ID + ';';

        db.query(updateFolderName, function(err) {
          if(err) {
            debug.print("Query failed err: " + err);
            throw err;
          }
          else {
            db.query(queryString, function(err) {
                if (err) {
                    debug.print("Query failed err:" + err);
                    if(!req.session.js){ // server render
                      res.redirect('/home?error=Could not add bookmark to ' + folderName + '!');
                    } else{ // client render
                      res.json({});
                    }
                    throw err;
                }
                else {
                  if(!req.session.js){ // server render
                    res.redirect('/home?error=Added bookmark to ' + folderName + '!');
                  } else{ // client render
                    res.json({});
                  }
                }
            });
          }
        });
      }

   else{
   	 if (req.body.folder == "" || req.body.folder_ID == "") {
   	   res.redirect('/home?error=Form is not filled correctly');
   	 }
     // if they're only updating the folder name
     else {
       var folderName = db.escape(req.body.folder);
       var folder_ID = db.escape(req.body.folder_ID);

       var updateFolderName = 'UPDATE folders SET Name=' + folderName + ' WHERE folder_ID=' + folder_ID + ';';

       db.query(updateFolderName, function(err) {
         if(err) {
           debug.print("Query failed err: " + err);
           throw err;
         }
         else {
           if(!req.session.js){ // server render
             res.redirect('/home?error=Updated folder name to ' + folderName + '!');
           } else{ // client render
             res.json({});
           }
          //  res.redirect('/home');
         }
       });
     }
   }
  }
