
/*  TODO: Add Function Blocks

 */
var config = require('./config');
var db = require('./db');
var debug = require('./debug');
var async = require('async');
var utility = require('./utility');
var json2csv = require('json2csv');
var Converter = require("csvtojson").Converter;
var util = require("util");
var fs = require("fs");

/*
* homePage
* the main view that the user can see their bookmarks and a nav bar/header with various functions
* */

module.exports.homePage = function(req, res) {

    debug.print('Received request for home page user id is: '+req.session.user_ID);
    var user;
    if (typeof req.session.user_ID === 'undefined') {
        //throw err
        // go to login
        debug.print('Warning: user went to homePage without a user_ID');
        req.session.destroy();
        res.redirect('/login');
    }
    else {
        user = req.session.user_ID;
        if (req.query.error) {
            var error = req.query.error;
            renderHomePage(getBookmarks, getFolders, "Most Visited", error, user, function (obj) {
                res.render('index', obj);
            })
        } else {
            renderHomePage(getBookmarks, getFolders, "Most Visited", "", user, function (obj) {
                res.render('index', obj);
            })
        }
  }
};

/*
* starredPage
* shows the user only the bookmarks they've starred
* */
module.exports.starredPage = function(req, res) {
  debug.print('info: Received request for starred page on user: '+req.session.user_ID);
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
    return;
  }
  user = req.session.user_ID;

  renderHomePage(getStarred, getFolders, "Starred", "", user,

    function(obj){ // This is called when render home page is done obj is the vars for index.ejs file
      res.render('index',obj);
    }, null
  );
}

/*
* Function getStarred
* retrieves the starred books from the db
* */
var getStarred = function(callback,user_ID){
  getBookmarks(function(err,bookmarks) {

    var results = [];
    if(bookmarks){
        debug.print("info: getStarred 21");
      bookmarks.forEach(function(bookmark){
        if(bookmark.Star == 1)
          results.push(bookmark);
      });

    }
    callback(err,results);
  },user_ID);
}

/*
* Function renderHomePage
* retrieves all the books data needed to populate the home page
* */
 var renderHomePage = function(bookmarkFunc, folderFunc, filter, errormsg, user_ID, done, searchstring){

   debug.print("info: Rendering Homepage");
   async.parallel([function(callback){bookmarkFunc(callback,user_ID,searchstring)},function(callback){folderFunc(callback,user_ID)}],
      function(err, results){
        if(err){
          throw err;
        }
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

/*
* folders
* users can associate their books into folders if so desired
* */
 module.exports.folders = function(req, res){
   var folder_ID = req.params.fid;

   var user;
   if (typeof req.session.user_ID === 'undefined') {
     debug.print('Warning: user went to homePage without a user_ID');
     req.session.destroy();
     res.redirect('/login');
   }
     else {
       user = req.session.user_ID;
       debug.print("info: folder_ID: " + folder_ID );

       var sql = "SELECT * FROM folder_has_books, books WHERE folder_has_books.folder_ID =" + folder_ID + " AND folder_has_books.book_ID = books.book_ID;";
       db.query(sql, function(err,bookmarks) {
         if (err) {
           res.status(500).send(err);
          //  res.redirect('/home?error=Could not delete folder.');
         } else {
           console.log("results: "+JSON.stringify(bookmarks,null,4));
           res.json({books: bookmarks});
           // res.redirect('/home');
         }
       });

   }
 }


/*
* clicked
* When a bookmark is clicked, the user is redirected to the stored url
* */
module.exports.clicked = function(req, res){

  debug.print("info: Received click bookmark request.\n" + JSON.stringify(req.body));

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

/*
* editPage
*
* */
module.exports.editPage = function(req, res) {
  getBookmarks(function(bookmarks) {

    return res.render('index', {
      bookmarks: bookmarks
    });
  })

}

// Need to authorize user before accepting star / delete
/*
* star
* when the star option is clicked, that book will toggle its star status in the db
* */
module.exports.star = function(req, res) {
  debug.print("info: Received star bookmark request:\n" + JSON.stringify(req.body));

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
 * insert
 * Adds a new bookmark to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res) {
  debug.print("info: Received insert bookmark request.\n" + JSON.stringify(req.body));

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
              debug.print("ERROR: Query failed err:" + err);
              throw(err);
          }
          else {
              res.json({});

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



/*
* update
* allows a bookmark to be edited
* */
module.exports.update = function(req, res) {
    debug.print("info: Received update bookmark request.\n" + JSON.stringify(req.body));

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
		res.json({});
	});
}
else{
    //Alert message : all the fields have not been filled up
        debug.print('info: user did not complete new bookmark fields');
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


/*
* delete
* allows a bookmark to be deleted
* */
module.exports.delete = function(req, res) {
    debug.print("info: Received delete bookmark request.\n" + JSON.stringify(req.body));

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

/*
* import
* allows user to upload a .csv file of bookmarks
* */
module.exports.import = function (req, res) {
  debug.print("info: Received import bookmarks request.\n" + JSON.stringify(req.file));

  var user_ID;
  if (typeof req.session.user_ID === 'undefined') {
    //throw err
    // go to login
    debug.print('Warning: user tried to insert a bookmark without a user_ID');
    req.session.destroy();
    res.redirect('/login?error=You are not logged in');
      return;
  }
  //else
  user_ID = db.escape(req.session.user_ID);

  if (req.file) {
      debug.print(util.inspect(req.file));
		if (req.file.size === 0) {
            debug.print("info: user did not select an appropriate file to import");
		}
		fs.exists(req.file.path, function(exists) {
			if(exists) {
        var converter = new Converter({});
        converter.fromFile(req.file.path,function(err,results){
          if(results){
            async.map(results,
              function(result,callback){
                addBookmark(result,user_ID,callback);
              },
              function(err,results){
                debug.print("info: Finished processing import request");
                res.json();
              }
            );
          }
        });
			} else {
				res.end("info: exiting import request");
			}
		});
	}
}

/*
* Function addBookmark
* attempts to insert the new bookmark into the db
* */
var addBookmark = function(bookmark, user_ID,callback){
  var title = db.escape(bookmark.Title);
  var star = db.escape(bookmark.Star);
  var description = db.escape(bookmark.Description);
  var URL = db.escape(bookmark.URL);
  var queryString = 'INSERT INTO books (Title, Star, Description, URL, user_ID) VALUES ('
      + title + ',' + star + ', ' + description + ', ' + URL + ', ' + user_ID + ');';

  debug.print('info: getBookmark querystring: '+queryString);
  db.query(queryString, function(err) {
      if (err) {
          debug.print("ERROR: Query failed err:" + err);
          throw(err);
      }
      callback(err);
  });
}

/**
* Function getBookmarks
* retrieves the bookmarks for a particular user
* */
var getBookmarks = function(callback, user) {

  var sql = "SELECT * FROM books WHERE user_ID=" + user + ";";

  db.query(sql, function(err, bookmarks) {
    if (err) {
      throw err;
    }
    callback(err,bookmarks);
  });

}

/**
 * export
 * creates a .csv output of all the users bookmarks and displays them to the screen
 * */
module.exports.export = function(req, res){
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning 025: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
    return;
  }
  user = req.session.user_ID;
  getBookmarks(function(err,bookmarks){
    var fields = ['Title', 'Star', 'Description', 'URL', 'Clicks'];
    json2csv({ data: bookmarks, fields: fields }, function(err, csv) {
      if (err) {
          debug.print('ERROR: getBookmarks callback '+err);
      }
        debug.print('info: csv: '+csv);
      res.write(csv);
      res.end();
    });
  }, user);
}



/**
 * getbooks
 * */
module.exports.getbooks = function(req,res){
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
    return;
  }
  user = req.session.user_ID;
  getBookmarks(function(err,bookmarks){

    res.json({books: bookmarks});
  }, user);
}

module.exports.getfolders = function(req,res){
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
    return;
  }
  user = req.session.user_ID;
  getFolders(function(err,folders){

    res.json({folders: folders});
  }, user);
}


/**
 * Function getFolders
 * retrieves the folders associated with that user
 * */
var getFolders = function(callback, user) {
    debug.print("info: Received getFolders request: 31");
  var sql = "SELECT * FROM folders WHERE user_ID=" + user + ";";

  db.query(sql, function(err, folders) {
    debug.print("ERROR in getFolders: 32");
    if (err) {
      throw err;
    }
    callback(err,folders);
  });
}

/**
 * Function mostVisistedCompare
 * determines which of two books have been clicked the most
 * */
var mostVisitedCompare = function(bookmark1, bookmark2){
  return bookmark1.Clicks - bookmark2.Clicks;
}

/**
 * find
 * fields a search on the user's books
 * */
module.exports.find = function (req, res) {

  debug.print ("info: Received search request: \n" + JSON.stringify(req.query));

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

/**
 * Function matchBookmarks
 * aids the search in finding matches
 * */
var matchBookmarks = function(callback, user_ID, searchstring){

  debug.print("info: Matching bookmarks that match: " + searchstring + " for user " + user_ID);
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

/**
 * createFolder
 * allows the user to create a new folder
 * */
// module.exports.createFolder=function(req, res) {
//   // debug.print("req.body: "+JSON.stringify(req.body,null,4));
// }

var compareTitle = function (a,b){
  return a.Title.localeCompare(b.Title);
}

var pullTitle = function(callback, user_ID){
 getBookmarks(function(err,bookmarks) {

  bookmarks.sort(compareTitle);

  callback(err, bookmarks);
 }, user_ID);

}




module.exports.showAll = function(req,res){

var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
  }
  user = req.session.user_ID;
  renderHomePage(getBookmarks,getFolders,"All","",user,
    function(obj){ // This is called when render home page is done obj is the vars for index.ejs file
      res.render('index',obj);
    }
  );

}

module.exports.sortBooks = function(req,res) {

var user;

  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
  }
  //console.log("getbookmarks "+ JSON.stringify(getBookmarks));
  //console.log("getbookmarks "+ JSON.stringify(getBookmarks.Title);

  user = req.session.user_ID;

  renderHomePage(pullTitle,getFolders,"Sort","",user,
    function(obj){ // This is called when render home page is done obj is the vars for index.ejs file
      res.render('index',obj);
    }
  );
}
