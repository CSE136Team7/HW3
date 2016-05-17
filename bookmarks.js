
/*  TODO: Add Function Blocks

 */
var config = require('./config');
var db = require('./db');
var debug = require('./debug');
var async = require('async');
var utility = require('./utility');
var xlsx = require('node-xlsx');
// import xlsx from 'node-xlsx';
/**
 *
 * renders the page to index.ejs
 */
/* //COULD NOT RESOLVE TODO: Merge this back in
module.exports.homePage = function(req, res) {

    */
module.exports.homePage = function(req, res) {
  debug.print('Received request for home page');
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
      if (typeof req === 'undefined' || typeof req.session === 'undefined') {
          res.redirect('/login');
      }
      req.session.destroy();
    res.redirect('/login');
  }
  user = req.session.user_ID;
  if(req.query.error){
    var error = req.query.error;
    renderHomePage(getBookmarks,getFolders,"Most Visited",error,user,function(obj){
        res.render('index',obj);
    })
  } else {
    renderHomePage(getBookmarks,getFolders,"Most Visited", "",user,function(obj){
        res.render('index',obj);
    })
  }
};

module.exports.starredPage = function(req, res) {
  debug.print('Received request for starred page sessID: '+req.session.user_ID);
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
  }
  user = req.session.user_ID;
  renderHomePage(getStarred,getFolders,"Starred","",user,
    function(obj){ // This is called when render home page is done obj is the vars for index.ejs file
      res.render('index',obj);
    }
  );
}

var getStarred = function(callback,user_ID){
  getBookmarks(function(err,bookmarks) {
    var results = [];
    if(bookmarks){
      bookmarks.forEach(function(bookmark){
        if(bookmark.Star == 1)
          results.push(bookmark);
      });

    }
    callback(err,results);
  },user_ID);
}

 var renderHomePage = function(bookmarkFunc, folderFunc, filter, errormsg, user_ID, done, searchstring){
   async.parallel([function(callback){bookmarkFunc(callback,user_ID,searchstring)},function(callback){folderFunc(callback,user_ID)}],
      function(err, results){
        var bookmarks = results[0];
        var folders = results[1];
        done({
                 bookmarks : bookmarks,
                 folders   : folders,
                 filter    : filter,
                 errormsg  : errormsg
               });
      }
   )

 }

 module.exports.folders = function(req, res){
   var folder_ID = req.body.folder_ID;
   var getFoldersBookmarks = function(callback) { db.query('SELECT * FROM folder_has_books, books WHERE folder_has_books.folder_ID = ' + folder_ID + ' AND folder_has_books.book_ID = books.book_ID', callback) };
   renderHomePage(getFoldersBookmarks,getFolders,"Folder Name", "",function(obj){

     res.render('index',obj);
   })
 }





module.exports.clicked = function(req, res){
  debug.print("Received click bookmark request.\n" + JSON.stringify(req.body));

  var user_ID;
  if (typeof req.session.user_ID === 'undefined') {
    //throw err
    debug.print('Warning: user tried to click a bookmark without a user_ID');
    req.session.destroy();
    // go to login
    res.redirect('/login?error=You are not logged in');
  }
  else {
    user_ID = db.escape(req.session.user_ID);
  }

  var book_ID = db.escape(req.body.book_ID);
  var url = req.body.url;
  var sql = 'UPDATE books SET Clicks = Clicks + 1 WHERE book_ID = ' + book_ID + ' AND user_ID = ' + user_ID;

  if(!utility.isURL(url)) {
    throw new Error('invalid URL');
  }

  db.query(sql, function(err) {
    if (err) throw err;
    res.redirect(url);
    res.end();
  });
}

module.exports.editPage = function(req, res) {
  getBookmarks(function(bookmarks) {

    return res.render('index', {
      bookmarks: bookmarks
    });
  })

}

// Need to authorize user before accepting star / delete
module.exports.star = function(req, res) {
  debug.print("Received star bookmark request:\n" + JSON.stringify(req.body));

  var user_ID;
  if (typeof req.session.user_ID === 'undefined') {
    //throw err
    debug.print('Warning: user tried to star a bookmark without a user_ID');
    req.session.destroy();
    // go to login
    res.redirect('/login?error=You are not logged in');
  }

  user_ID = db.escape(req.session.user_ID);
  var starred = req.body.starred ^ 1;
  var book_ID = db.escape(req.body.book_ID);

  //Need to do validation on book_ID && user_ID
  var sql = "UPDATE books SET Star=" + starred + " WHERE user_ID=" + user_ID +
    " AND book_ID=" + book_ID;

  db.query(sql, function(err) {
    if (err) {
        res.redirect('/home?error=Invalid form entry');
      throw err;
    }
    else {
      //debug.print('not an err');
    }
    res.redirect('/home');
  });

}

/**
 * Adds a new bookmark to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res) {
  debug.print("Received insert bookmark request.\n" + JSON.stringify(req.body));

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

 	if (req.body.title != ""
 		&& req.body.url != ""
 		&& req.body.user_ID != ""
 		&& req.body.book_ID != ""){


      var title = db.escape(req.body.title);
 	  var url = db.escape(req.body.url);
      var description = db.escape(req.body.description);
      //var user_ID = db.escape(req.body.user_ID);
      var book_ID = db.escape(req.body.book_ID);

      var queryString = 'INSERT INTO books (Title, Star, Description, URL, user_ID, book_ID) VALUES ('
          + title + ',' + 0 + ', ' + description + ', ' + url + ', ' + user_ID + ', ' + book_ID + ')';


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
 	if (req.body.title == "" && req.body.url == "" ) {
 		res.redirect('/home?error=Please specify a title and a URL for your bookmark');
 	}
 	if (req.body.title == "" ) {
 		res.redirect('/home?error=Please specify a title for your bookmark');
 	}
 	if (req.body.url == "" ) {
 		res.redirect('/home?error=Error, you forgot to enter the URL');
 	}
 	else {
 		res.redirect('/home?error=The form was not filled properly');
 	}
 }
}

// update
module.exports.update = function(req, res) {
    debug.print("Received update bookmark request.\n" + JSON.stringify(req.body));

    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {
      //throw err
      // go to login
      debug.print('Warning: user tried to update a bookmark without a user_ID');
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
    }
    //else
    user_ID = db.escape(req.session.user_ID);


	if (req.body.title != ""
		&& req.body.url != ""
        && req.body.description != ""
		&& req.body.user_ID != ""
		&& req.body.book_ID != ""){

	var book_ID = db.escape(req.body.book_ID);
	//var user_ID = db.escape(req.body.user_ID);
	var title = db.escape(req.body.title);
	var url = db.escape(req.body.url);
    var description = db.escape(req.body.description);

	var queryString = 'UPDATE books SET Title = ' + title + ', URL = ' + url + ', Description = ' + description + ' WHERE book_ID=' + book_ID + ' AND user_ID=' + user_ID;
	debug.print(queryString);
	db.query(queryString, function(err) {
		if (err) {throw err;}
		res.redirect('/home');
	});
}
else{
    //Alert message : all the fields have not been filled up
    if (req.body.title == "" ) {
    	res.redirect('/home?error=Error, Please specify a title for your bookmark');
    }
    if (req.body.url == "" ) {
    	res.redirect('/home?error=Error, you entered an empty url');
    }
    if (req.body.description == "") {
      res.redirect('/home?error=Error, please provide a description.');
    }
    else {
    	res.redirect('/home?error=The form was not filled properly');
    }
}
  }
  // delete
module.exports.delete = function(req, res) {
    debug.print("Received delete bookmark request.\n" + JSON.stringify(req.body));

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

    // Do validation on book_ID && user_ID
    if (req.body.book_ID && req.body.user_ID) {
      // get userid and book_ID
      var book_ID = db.escape(req.body.book_ID);
      //var user_ID = db.escape(req.body.user_ID);
    } else {
      throw new Error('book_ID or user_ID is null/invalid.');
    }

    var sql = "DELETE FROM BOOKS WHERE user_ID=" + user_ID +
      " AND book_ID=" + book_ID + ";";

    db.query(sql, function(err) {
      if (err) {
        res.redirect('/home?error=Could not delete bookmark.');
      } else {
        res.redirect('/home');
      }
    });
  }

module.exports.import = function (req, res) {
  var file = req.body.file;
}
  // Get list of bookmarks for user 3 for now until users are set up.
var getBookmarks = function(callback, user) {

  var sql = "SELECT * FROM books WHERE user_ID=" + user + ";";

  db.query(sql, function(err, bookmarks) {
    if (err) {
      throw err;
    }
    callback(err,bookmarks);
  });

}

var getFolders = function(callback, user) {

  var sql = "SELECT * FROM folders WHERE user_ID=" + user + ";";

  db.query(sql, function(err, folders) {
    if (err) {
      throw err;
    }
    callback(err,folders);
  });
}

var mostVisitedCompare = function(bookmark1, bookmark2){
  return bookmark1.Clicks - bookmark2.Clicks;
}


module.exports.find = function (req, res) {
  debug.print ("Search title \n" + JSON.stringify(req.body));
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
  }
  user = req.session.user_ID;
  var searchstring = req.query.searchbox;

  if (searchstring == null || searchstring.length === 0 ){
    return res.redirect('/home');
  }
  searchstring = searchstring.toLowerCase();

  renderHomePage(matchBookmarks,getFolders,"Search Results","",user,
    function(obj){ // This is called when render home page is done obj is the vars for index.ejs file
      res.render('index',obj);
    }, searchstring
  );
}
var getStarred = function(callback,user_ID){

}
var matchBookmarks = function(callback, user_ID, searchstring){
  getBookmarks(function(err,bookmarks) {
    var results = [];
    for (var i= 0; i < bookmarks.length ;i++)  {

      var s = bookmarks[i].Title.toLowerCase();

      if (s.indexOf(searchstring) >= 0 ){
        results.push(bookmarks[i]);
      }
    };
    callback(err,results);
  },user_ID);
}

module.exports.createFolder=function(req, res) {
  // console.log("req.body: "+JSON.stringify(req.body,null,4));
}
