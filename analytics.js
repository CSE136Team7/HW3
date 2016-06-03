
var db = require('./db');
var debug = require('./debug');

module.exports.init = function(){


}
// `Clicks` int DEFAULT 0,
// `BooksCreated` int DEFAULT 0,
// `FoldersCreated` int DEFAULT 0,
module.exports.inc = function(key, user_ID){
  var dbkey = "";
  console.log(key);
  switch (key) {
    case "Clicks":
      dbkey = "Clicks";
      break;
    case "LoggedIn":
      dbkey = "LoggedIn";
      break;
    case "BooksCreated":
      dbkey = "BooksCreated";
      break;
    case "FoldersCreated":
      dbkey = "FoldersCreated";
      break;
    default:
      // Error
      throw new Error("Invalid Store specified");
      break;
  }
  var sql = 'UPDATE analytics SET ' + dbkey + ' = ' + dbkey + ' + 1 WHERE user_ID = ' + user_ID + ';';

  db.query(sql, function(err) {
    if(err) throw err;
  });
}

module.exports.log = function(key,val) {
  var sql =

  db.query(sql, function(err) {
    if (err) throw err;
    if(!req.session.js){ // server render
        res.redirect('/home?error=Deleted bookmark from your bookmarks!');
    } else{ // client render
      res.json({});
    }
  });
}
