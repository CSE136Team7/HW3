/*  TODO: Add Function Blocks

 */
var config = require('./config');
var db = require('./db');
var debug = require('./debug');
var utility = require('./utility');

/**
 *
 * renders the page to index.ejs
 */
module.exports.homePage = function(req, res) {
  debug.print('inside home page user id is: '+req.session.user_ID);
  var user;
  if (typeof req.session.user_ID === 'undefined') {
      //throw err
    // go to login
    debug.print('Warning: user went to homePage without a user_ID');
    req.session.destroy();
    res.redirect('/login');
  }
  user = req.session.user_ID;

  debug.print(req.query);
  getBookmarks(function(bookmarks) {
    bookmarks.sort(mostVisitedCompare);
    bookmarks.reverse(); // Descending order
    if(req.query.error){
      return res.render('index', {
        bookmarks: bookmarks,
        errormsg: req.query.error
      });
    } else{
      return res.render('index', {
        bookmarks: bookmarks,
        errormsg: ""
      });
    }
  }, user
  )
};

// module.exports.mostVisitedPage = function(req, res) {
//   getBookmarks(function(bookmarks) {
//     bookmarks.sort(mostVisitedCompare);
//     bookmarks.reverse(); // Descending order
//     return res.render('index', {
//       bookmarks:
//     });
//   })
//
// };

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
  var url = db.escape(req.body.URL);
  var sql = 'UPDATE bookmarks SET Clicks = Clicks + 1 WHERE book_ID = ' + book_ID + ' AND user_ID = ' + user_ID;

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

  var user_ID;
  if (typeof req.session.user_ID === 'undefined') {
    //throw err
    debug.print('Warning: user tried to star a bookmark without a user_ID');
    req.session.destroy();
    // go to login
    res.redirect('/login?error=You are not logged in');
  }
  else {
    user_ID = db.escape(req.session.user_ID);
  }

  var starred = req.body.starred ^ 1;
  var book_ID = db.escape(req.body.book_ID);
  //var user_ID = req.body.user_ID;

  //Need to do validation on book_ID && user_ID
  var sql = "UPDATE books SET Star=" + starred + " WHERE user_ID=" + user_ID +
    " AND book_ID=" + book_ID + ";";

  db.query(sql, function(err) {
    if (err) {
      throw err;
      res.redirect('/home?error=Invalid form entry');
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

      var queryString = 'INSERT INTO books (Title, Star, Description, URL, user_ID, book_ID) VALUES (' + title + ',' + 0 + ', ' + description + ', ' + url + ', ' + user_ID + ', ' + book_ID + ')';

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

    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {
      //throw err
      // go to login
      debug.print('Warning: user tried to update a bookmark without a user_ID');
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
    }
    //else
    user = db.escape(req.session.user_ID);

	if (req.body.title != "" 
		&& req.body.url != "" 
		&& req.body.user_ID != ""
		&& req.body.book_ID != ""){

		var book_ID = db.escape(req.body.book_ID);
	//var user_ID = db.escape(req.body.user_ID);
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

    var user_ID;
    if (typeof req.session.user_ID === 'undefined') {
      //throw err
      // go to login
      debug.print('Warning: user tried to insert a bookmark without a user_ID');
      req.session.destroy();
      res.redirect('/login?error=You are not logged in');
    }
    //else
    user = db.escape(req.session.user_ID);

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
  // Get list of bookmarks for user 3 for now until users are set up.
var getBookmarks = function(callback, user) {

  var sql = "SELECT * FROM books WHERE user_ID=" + user + ";";

  db.query(sql, function(err, bookmarks) {
    if (err) {
      throw err;
    }
    callback(bookmarks);
  });

}

var mostVisitedCompare = function(bookmark1, bookmark2){
  return bookmark1.Clicks - bookmark2.Clicks;
}
