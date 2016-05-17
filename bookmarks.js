/*  TODO: Add Function Blocks

 */
var config = require('./config');
var db = require('./db');
var debug = require('./debug');

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
    debug.print('bad user got to homePage without a user_ID');
    res.redirect('/login');
  }
  user = req.session.user_ID;


  getBookmarks(function(bookmarks) {
    bookmarks.sort(mostVisitedCompare);
    bookmarks.reverse(); // Descending order
    return res.render('index', {
      bookmarks: bookmarks
    });
  },
      user
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
  var user_ID;
  if (typeof req.session.user_ID === 'undefined') {
    //throw err
    debug.print('bad user got to homePage without a user_ID');

    req.session.destroy();
    // go to login
    res.redirect('/login');
  }
  else {
    user_ID = req.session.user_ID;
  }
  debug.print("Received click bookmark request.\n" + JSON.stringify(req.body));
  var book_ID = req.body.book_ID;

  var url = req.body.URL;
  var sql = 'UPDATE bookmarks SET Clicks = Clicks + 1 WHERE book_ID = ' + book_ID + ' AND user_ID = ' + user_ID;
  db.query(sql, function(err) {
    if (err) throw err;
    res.writeHead(301,
      {Location: url}
    );
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
    res.redirect('/home');
  });

}

/**
 * Adds a new bookmark to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res) {
  debug.print("Received insert bookmark request.\n" + JSON.stringify(req.body));
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var description = db.escape(req.body.description);
  var user_ID;
  //if (req.session.user_ID === 'undefined'){
    //debug.print('req.session did not have a user_ID');
    user_ID = db.escape(req.body.user_ID);
 // }
  //else {
    //user_ID = db.escape(req.session.user_ID);
  //}
  var book_ID = db.escape(req.body.book_ID);
  var queryString = 'INSERT INTO books (Title, Star, Description, URL, user_ID, book_ID) VALUES (' + title + ',' + 0 + ', ' + description + ', ' + url + ', ' + user_ID + ', ' + book_ID + ')';
  db.query(queryString, function(err) {
    if (err) {
      debug.print("Query failed err:" + err);
    }
    res.redirect('/home');
  });
};

// update
module.exports.update = function(req, res) {
    debug.print("Received update bookmark request.\n" + JSON.stringify(req.body));
    var book_ID = req.body.book_ID;
    var user_ID = req.body.user_ID;
    var title = db.escape(req.body.title);
    var url = db.escape(req.body.url);

    var queryString = 'UPDATE books SET title = ' + title + ', url = ' + url + ', WHERE book_ID = ' + book_ID + 'AND user_ID = ' + user_ID;
    db.query(queryString, function(err) {
      if (err) throw err;
      res.redirect('/home');
    });

  }
  // delete
module.exports.delete = function(req, res) {
    debug.print("Received delete bookmark request.\n" + JSON.stringify(req.body));
    // get userid and book_ID
    var book_ID = req.body.book_ID;
    var user_ID = req.body.user_ID;
    // Do validation on book_ID && user_ID
    var sql = "DELETE FROM BOOKS WHERE user_ID=" + user_ID +
      " AND book_ID=" + book_ID + ";";
    db.query(sql, function(err) {
      if (err) {
        throw err;
      }
      res.redirect('/home');
    });
  }
  // Get list of bookmarks for user 3 for now until users are set up.
var getBookmarks = function(callback, user) {
  var user_ID = user;


  var sql = "SELECT * FROM BOOKS WHERE user_ID=" + user_ID + ";";

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
