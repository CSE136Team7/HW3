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

 module.exports.homePage = function(req, res) {
    renderHomePage(getBookmarks,getFolders,"Most Visited", "",function(obj){

      res.render('index',obj);
    })
 };

 var renderHomePage = function(bookmarkFunc, folderFunc, filter, errormsg, done){

   async.parallel([function(callback){bookmarkFunc(callback)},function(callback){folderFunc(callback)}],
      function(err, results){

        var bookmarks = results[0];
        var folders = results[1];
        console.log(bookmarks);
        console.log(folders);
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
   console.log("req.body: "+req.body );
   var user_ID = 3;
 //   async.parallel([
 //   ,
 //   function(callback) { db.query("SELECT * FROM folders WHERE user_ID=" + user_ID, callback) }
 //   ], function(err, results) {
 //     console.log("hello: \n"+ JSON.stringify(results,null,4));
 //     if(err){
 //       throw err;
 //     }
 //     return res.render('index', {
 //       folders : results[1][0],
 //       bookmarks: results[0][0],
 //       errormsg: ""
 //     });
 // });
var getFoldersBookmarks = function(callback) { db.query('SELECT * FROM folder_has_books, books WHERE folder_has_books.folder_ID = ' + folder_ID + ' AND folder_has_books.book_ID = books.book_ID', callback) };
 renderHomePage(getFoldersBookmarks,getFolders,"Folder Name", "",function(obj){

   res.render('index',obj);
 })

 };





module.exports.clicked = function(req, res){
  debug.print("Received click bookmark request.\n" + JSON.stringify(req.body));
  var book_ID = req.body.book_ID;
  var user_ID = req.body.user_ID;
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

};

// Need to authorize user before accepting star / delete
module.exports.star = function(req, res) {
  debug.print("Received star bookmark request:\n" + JSON.stringify(req.body));

  var starred = req.body.starred ^ 1;
  var book_ID = req.body.book_ID;
  var user_ID = req.body.user_ID;

  //Need to do validation on book_ID && user_ID
  var sql = "UPDATE BOOKS SET Star=" + starred + " WHERE user_ID=" + user_ID +
    " AND book_ID=" + book_ID + ";";

  db.query(sql, function(err) {
    if (err) {
      throw err;
    }
    res.redirect('/home?error=Invalid form entry');
    //res.redirect('/home');
  });

}

/**
 * Adds a new bookmark to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res) {
  debug.print("Received insert bookmark request.\n" + JSON.stringify(req.body));

 	if (req.body.title != ""
 		&& req.body.url != ""
 		&& req.body.user_ID != ""
 		&& req.body.book_ID != ""){


 		var title = db.escape(req.body.title);
 	var url = db.escape(req.body.url);
 	var description = db.escape(req.body.description);
 	var user_ID = db.escape(req.body.user_ID);
 	var book_ID = db.escape(req.body.book_ID);

 	var queryString = 'INSERT INTO books (Title, Star, Description, URL, user_ID, book_ID) VALUES (' + title + ',' + 0 + ', ' + description + ', ' + url + ', ' + 3 + ', ' + book_ID + ')';

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
};

// update
module.exports.update = function(req, res) {
    debug.print("Received update bookmark request.\n" + JSON.stringify(req.body));

	if (req.body.title != ""
		&& req.body.url != ""
		&& req.body.user_ID != ""
		&& req.body.book_ID != ""){

		var book_ID = db.escape(req.body.book_ID);
	var user_ID = db.escape(req.body.user_ID);
	var title = db.escape(req.body.title);
	var url = db.escape(req.body.url);

	var queryString = 'UPDATE books SET Title = ' + title + ', URL = ' + url + ' WHERE book_ID=' + book_ID + ' AND user_ID=' + user_ID + ';';
	debug.print(queryString);
	db.query(queryString, function(err) {
		if (err) throw err;
		res.redirect('/home');
	});
}
else{
    //Alert message : all the fiels have not been filled up
    if (req.body.title == "" ) {
    	res.redirect('/home?error=Error, Please specify a title for your bookmark');
    }
    if (req.body.url == "" ) {
    	res.redirect('/home?error=Error, you entered an empty url');
    }
    else {
    	res.redirect('/home?error=The form was not filled properly');
    }
}
  };
  // delete
module.exports.delete = function(req, res) {
    debug.print("Received delete bookmark request.\n" + JSON.stringify(req.body));

    // Do validation on book_ID && user_ID
    if (req.body.book_ID && req.body.user_ID) {
      // get userid and book_ID
      var book_ID = db.escape(req.body.book_ID);
      var user_ID = db.escape(req.body.user_ID);
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
var getBookmarks = function(callback) {
  var user_ID = 3;

  var sql = "SELECT * FROM BOOKS WHERE user_ID=" + user_ID + ";";

  db.query(sql, function(err, bookmarks) {
    if (err) {
      throw err;
    }
    callback(err,bookmarks);
  });

}

var getFolders = function(callback) {
  var user_ID = 3;

  var sql = "SELECT * FROM folders WHERE user_ID=" + user_ID

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
  var searchstring = req.query.searchbox;

  if (searchstring == null || searchstring.length === 0 ){
    return res.redirect('/home');
  }
  searchstring = searchstring.toLowerCase();
  var results = [];

  getBookmarks(function(bookmarks){
    console.log(bookmarks);
    for (var i= 0; i < bookmarks.length ;i++)  {

      var s = bookmarks[i].Title.toLowerCase();

      if (s.indexOf(searchstring) >= 0 ){
        results.push(bookmarks[i]);
      }
    };

    return res.render('index', {
      bookmarks: results
    });
  });
}
