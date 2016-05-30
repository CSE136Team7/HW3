var debug = function(s) {
  var bool = 1;
  if (bool) {
    console.log(s);
  }
}
var loadBookmarksList = function() {};

var showEdit = function(id) {
  console.log("Doesent work"); // This is not the showEdit function that will be called
};


window.onload = function() {

  /**
   *  Uses Ajax to get the book list data from the server.
   */

  function loadBookmarksList() {

    ajax('/bookmarks/getbooks/', 'GET', null, function(books) {
      debug(JSON.stringify(books));
      loadTemplate('booklist', {
        books: books.books
      });
      loadTemplate('bookmodals', {
        books: books.books
      });
    });
  }

  function loadFoldersList() {
    ajax('/bookmarks/getfolders/', 'GET', null, function(folders) {
      loadTemplate('folderlist', folders);
    });
  }
  // This function is initialized above, before the window loads.
  // It shows the update bookmarkform and adds a form submit listener
  // for the form that is active.
  showEdit = function(id) {
    // Changes the browser URL to /index.html#updateModal(IDNUMBER)
    // This opens the correct update bookmark modal
    window.location = '#updateModal' + id;

    // There are many update bookmark modals and forms so select the right one
    var activeForm = document.getElementById('update-bookmark-form' + id);
    // Then add a submit listener to only that form (the activeform).
    // Probably want to unlink this listener later.
    activeForm.addEventListener('submit', function(ev) { // When the form is submitted...
      // save all the input datas into json format
      var oData = new FormData(activeForm);

      // Send the data as a POST to the update route
      ajax("bookmarks/update", "POST", oData, function(){
        // Finally when this callback is called reload the list of bookmarks on the homepage
        loadBookmarksList();
      });
      // Prevent the HTML form natural submission
      ev.preventDefault();
    }, false);
  }

  // When the window loads, reload bookmarks and folders list
  loadBookmarksList();
  loadFoldersList();


  /**
   * Capture back/forward button.
   * When the button is pressed, load the appropriate page and data based on the e.state
   */
  window.addEventListener('popstate', function(e) {
    var pageName = e.state.pageName;
    displayTemplate(templatesCache[pageName], e.state);
  });

  /*  variable used to store templates in a cache to prevent multiple requests on static file */
  var templatesCache = [];

  /**
   * Short, generic Ajax function to avoid jquery usage
   */
  function ajax(url, method, data, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var contentType = request.getResponseHeader('content-type') || '';
        var response;

        if (contentType.indexOf('json') >= 0) {
          response = JSON.parse(request.responseText);
        } else {
          response = request.responseText;
        }

        callback(response);
      }
    };

    if (data) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      request.send(data);
    } else {
      request.send();
    }
  }

  function displayTemplate(name, data) {
    //console.log(JSON.stringify(data));
    var snippet = ejs.render(templatesCache[name], data);
    document.getElementById(name).innerHTML = snippet;
  }

  /**
   *   Adds Request to History
   *   Checks if template exists in the cache.  If so, calls displayTemplate.
   *   If not, first loads template and adds it to cache before calling displayTemplate.
   */
  function loadTemplate(name, data) {
    addToHistory(name, data);

    if (templatesCache[name]) {
      displayTemplate(name, data);
    } else {
      ajax('/views/' + name + '.ejs', 'GET', null, function(template) {
        console.log(template);
        templatesCache[name] = template;
        displayTemplate(name, data);
      });
    }
  }

  function addToHistory(name, data) {
    data = data || {};
    data.pageName = name;
    history.pushState(data, null, "/views/index.html#" + name);
  }

  var addBookForm = document.getElementById("add-bookmark-form");

  addBookForm.addEventListener('submit', function(ev) {
    var oData = new FormData(addBookForm);
    ajax("/bookmarks/insert", "POST", oData, function(){

      loadBookmarksList();
    });

    ev.preventDefault();
  }, false);

  var importBookForm = document.getElementById("import");
  importBookForm.addEventListener('submit', function(ev) {
    var oData = new FormData(importBookForm);
    ajax("/bookmarks/import", "POST", oData, function(){

      loadBookmarksList();
    });

    ev.preventDefault();
  }, false);

}
