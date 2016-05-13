/*  TODO: Add Function Blocks

 */

var db = require('./db');

/**
 *
 * Selects all bookmarks and then renders the page with the list.ejs template
 */
var list = module.exports.list = function(req, res) {
  db.query('SELECT * from bookmarks ORDER BY id', function(err, bookmarks) {
    if (err) throw err;

    res.render('templates/index', {bookmarks: books});
  });
};

/**
 *
 * Selects information about passed in bookmark and then
 * renders the delete confirmation page with the delete.ejs template
 */
module.exports.confirmdelete = function(req, res){
  var id = req.params.bookmark_id;
  db.query('SELECT * from bookmarks WHERE id =  ' + id, function(err, bookmark) {
    if (err) throw err;
    res.render('bookmarks/delete', {bookmark: bookmark[0]});
  });
};

/**
 *
 * Renders the add page with the add.ejs template
 */
module.exports.add = function(req, res) {
  res.render('bookmarks/add');
};

/**
 *
 * Selects information about the passed in bood and then
 * renders the edit confirmation page with the edit.ejs template
 */
module.exports.edit = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('SELECT * from bookmarks WHERE id =  ' + id, function(err, bookmark) {
    if (err) throw err;

    res.render('bookmarks/edit', {bookmark: bookmark[0]});
  });
};

/**
 * Deletes the passed in bookmark from the database.
 * Does a redirect to the list page
 */
module.exports.delete = function(req, res) {
  var id = req.params.bookmark_id;
  db.query('DELETE from bookmarks where id = ' + id, function(err){
    if (err) throw err;
    res.redirect('/bookmarks');
  });
};

/**
 * Adds a new bookmark to the database
 * Does a redirect to the list page
 */
module.exports.insert = function(req, res){
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var title = db.escape(req.body.title);

  var queryString = 'INSERT INTO bookmarks (title, url, title) VALUES (' + title + ', ' + url + ', ' + title + ')';
  db.query(queryString, function(err){
    res.redirect('/bookmarks');
  });
};

/**
 * Updates a bookmark in the database
 * Does a redirect to the list page
 */
module.exports.update = function(req, res){
  var id = req.params.bookmark_id;
  var title = db.escape(req.body.title);
  var url = db.escape(req.body.url);
  var title = db.escape(req.body.title);

  var queryString = 'UPDATE bookmarks SET title = ' + title + ', url = ' + url + ', title = ' + title + ' WHERE id = ' + id;
  db.query(queryString, function(err){
    if (err) throw err;
    res.redirect('/bookmarks');
  });
};
