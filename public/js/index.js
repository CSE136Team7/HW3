var debug = function(s) {
  var bool = 1;
  if (bool) {
    console.log(s);
  }
}

var currBooks = [];

function showDelete(id){
  window.location = '#deleteModal' + id;

  var activeForm = document.getElementById('delete-bookmark-form' + id);
  activeForm.addEventListener('submit', function(ev) { // When the form is submitted...
    // save all the input datas into json format
    var oData = new FormData(activeForm);
    console.log(JSON.stringify(oData));
    // Send the data as a POST to the update route
    ajaxPost("/bookmarks/delete", oData, function() {
      // Finally when this callback is called reload the list of bookmarks on the homepage
      loadBookmarksList();
    });
    // Prevent the HTML form natural submission
    ev.preventDefault();
  }, false);
}
// If you are just reloading a users bookmarks dont pass a custom list
// of bookmarks
function loadBookmarksList(custom) {
  if (!custom) {
    ajax('/bookmarks/getbooks/', 'GET', null, function(books) {
      if(books.error){
        window.location = '/login';
      }
      currBooks = books.books;
      debug(JSON.stringify(books));
      loadTemplate('booklist', {
        books: books.books
      });
      loadTemplate('bookmodals', {
        books: books.books
      });
    });
  } else {
    currBooks = custom;
    loadTemplate('booklist', {
      books: custom
    });

    loadTemplate('bookmodals', {
      books: custom
    });
  }
}
var compareTitle = function (a,b){
  return a.Title.localeCompare(b.Title);
}

function sortBooks(){
  currBooks.sort(compareTitle);
  loadBookmarksList(currBooks);
}



var showEdit = function(id) {
  console.log("Doesent work"); // This is not the showEdit function that will be called
};

function validate(textbox) {
  console.log('Textbox: ' + textbox);
  if (textbox === '') {
    return false;
  } else {
    return true;
  }
}

function validateURL(url) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return pattern.test(url);
}

function validateFile() {
  var file = document.forms["importForm"]["myFile"].value;
  var allowedExtension = "csv";
  var fileExtension = file.split('.').pop();

  if (allowedExtension === fileExtension) {
    console.log('import successful!');
    closeImportModal();
    return true;
  } else {
    alert('not a valid csv file!');
    return false;
  }
}

function loadFoldersList() {
  ajax('/bookmarks/getfolders/', 'GET', null, function(folders) {
    if(folders.error){
      window.location = '/login';
    }
    loadTemplate('folderlist', folders);
  });
}

function ajax(url, method, data, callback) {
  var request = new XMLHttpRequest();
  request.open(method, url, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {

      var contentType = request.getResponseHeader('content-type') || '';
      var response;
      if (contentType.indexOf('json') >= 0) {
        response = JSON.parse(request.responseText)
      } else {
        response = request.responseText;
      }
      // console.log("response:--> "+JSON.stringify(response,null,4));
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
/*  variable used to store templates in a cache to prevent multiple requests on static file */
var templatesCache = [];



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
      // console.log(template);
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
/**
 * Short, generic Ajax function to avoid jquery usage
 */


function displayTemplate(name, data) {
  //console.log(JSON.stringify(data));
  var snippet = ejs.render(templatesCache[name], data);
  document.getElementById(name).innerHTML = snippet;
}

function showAddModal() {
  document.getElementById("addModal").style.visibility = "visible";
  document.getElementById("add-bookmark-form").reset();
}

function showAddFolderModal() {
  document.getElementById("folderModal").style.visibility = "visible";
  document.getElementById("add-folder-form").reset();
}

function showImportModal() {
  document.getElementById("importBookmark").style.visibility = "visible";
}

function closeAddModal() {
  var title = document.getElementById("bookTitle").value;
  var url = document.getElementById("bookURL").value;
  var description = document.getElementById("bookDescription").value;

  console.log('Title: ' + title);
  console.log('URL: ' + url);
  console.log('Description: ' + description);

  console.log(validate(title));
  console.log(validate(description));

  if (validate(title) && validateURL(url) && validate(description)) {
    document.getElementById("addModal").style.visibility = "hidden";
  }
}

function closeFolderAddModal() {
  var folderName = document.getElementById("Folder_input").value;

  if (validate(folderName)) {
    document.getElementById("folderModal").style.visibility = "hidden";
  }
}

function closeImportModal() {

  document.getElementById("importBookmark").style.visibility = "hidden";
  document.forms["importForm"]["myFile"].value = '';


}


function folderModaledit(id,name){
  ajax('/bookmarks/getbooks/', 'GET', null, function(books){
    loadTemplate('foldermodallist', {books : books.books,id:id,name:name});
  });
  document.getElementById("folderModaledit").style.visibility = "visible";
}

function addbookstoFolder() {
  var updateFolder = document.getElementById("update-folder-form");
  updateFolder.addEventListener('submit', function(ev) {
    var oData = new FormData(updateFolder);
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
      if (oReq.readyState == 4 && oReq.status == 200) {
        loadFoldersList();
      }
    };
    oReq.open("POST", "/addBookToFolder", true);
    oReq.send(oData);
    ev.preventDefault();
  }, false);
  document.getElementById("folderModaledit").style.visibility = "hidden";
}

function deleteBookmark(id){
  var deleteBookmarkForm = document.getElementById('delete-bookmark-form' + id);
  var oData = new FormData(deleteBookmarkForm);
  ajaxPost('/bookmarks/delete', oData, function(){
    loadBookmarksList();
  });

}

function deleteFolders(id) {
  var deleteFolderform = document.getElementById('delete-folder-form-' + id);
  if (deleteFolderform) {
    var oData = new FormData(deleteFolderform);
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
      if (oReq.readyState == 4 && oReq.status == 200) {
        loadFoldersList();
      }
    };
    oReq.open("POST", "/deleteFolder", true);
    oReq.send(oData);
  }
}

function getFolders(id) {
  console.log("i am inside folder");
  ajax('/folders?fid=' + id, 'GET', null, function(books) {
    console.log(books);
    loadTemplate('booklist', {
      books: books.books
    });
  });
}

function addListeners() {
  console.log('starring using Ajax');
  var star = document.getElementsByName('star');
  console.log(star.length);
  for(var i = 0; i < star.length; ++i) {
    star[i].addEventListener('submit', function(ev) {
      var oData = new FormData(this);//{book: {starred: star[i].starred.value, book_ID: star[i].book_ID.value}};
      console.log(JSON.stringify(oData));
      ajaxPost("/bookmarks/star", oData, function() {
        loadBookmarksList(currBooks);
      });
      ev.preventDefault();
    }, false);
  }
}

function getStarred() {
  ajax('/folder/starred', 'GET', null, function(books) {
    loadTemplate('booklist', {
      books: books.books
    });
  });
}

function getMostVisited() {
  loadBookmarksList();
}

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

function ajaxPost(url, data, callback) {
  var oReq = new XMLHttpRequest();
  oReq.open("POST", url, true);
  oReq.onreadystatechange = function() {
    if (oReq.readyState == 4 && oReq.status == 200) {
      callback();
    }
  };

  oReq.send(data);
}

function displayTemplate(name, data) {
  //console.log(JSON.stringify(data));
  var snippet = ejs.render(templatesCache[name], data);
  document.getElementById(name).innerHTML = snippet;
  if(name === 'booklist'){
    addListeners();
  }
}



function addToHistory(name, data) {
  data = data || {};
  data.pageName = name;
  history.pushState(data, null, "/views/index.html#" + name);
}

window.onload = function() {

  /**
   *  Uses Ajax to get the book list data from the server.
   */


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
      console.log(JSON.stringify(oData));
      // Send the data as a POST to the update route
      ajaxPost("/bookmarks/update", oData, function() {
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




  var addBookForm = document.getElementById("add-bookmark-form");
  var createFolder = document.getElementById("add-folder-form");
  var searchForm = document.getElementById("search-form");

  searchForm.addEventListener('submit', function(ev) {
    var query = document.forms['search-form']['searchbox'].value;
    console.log('hello');
    ajax('/find?searchbox=' + query, 'GET', null, function(results) {
      loadBookmarksList(results);
    });
    ev.preventDefault();
  }, false);

  addBookForm.addEventListener('submit', function(ev) {
    var oData = new FormData(addBookForm);
    ajaxPost("/bookmarks/insert", oData, function() {

      loadBookmarksList();
    });

    ev.preventDefault();
  }, false);



  createFolder.addEventListener('submit', function(ev) {
    var oData = new FormData(createFolder);
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function() {
      if (oReq.readyState == 4 && oReq.status == 200) {
        loadFoldersList();
      }
    };
    oReq.open("POST", "/createFolder", true);
    oReq.send(oData);
    ev.preventDefault();
  }, false);

  var importBookForm = document.getElementById("import");

  importBookForm.addEventListener('submit', function(ev) {
    var oData = new FormData(importBookForm);
    if (validateFile()) {
      ajaxPost("/bookmarks/import", oData, function() {

        loadBookmarksList();
      });
    }
    ev.preventDefault();
  }, false);


  var menuButton = document.getElementById("menu");
  var sidebar = document.getElementById("sidebar");
  var menuIcon = document.getElementById("menu-icon");
  var triggerSubmit = document.getElementById("trigger-submit");

  menuButton.onclick = function() {
    var right = document.getElementById("right");
    if (sidebar.style.display !== 'none') {
      sidebar.style.display = 'none';
      right.style.width = '100%';
      menuButton.style.color = "#FFF";
    } else {
      sidebar.style.display = 'block';
      right.style.width = '82%';
      menuButton.style.color = "#FF9EAE";
    }
  };

  // var addBookmark = document.getElementById("add-bookmark");
  // var importBookmark = document.getElementById("import-bookmark");
  // var addBookmarkForm = document.getElementById("add-bookmark-form");
  // var importBookmarkForm = document.getElementById("import-bookmark-form");
  //
  // var SignIn = document.getElementById("signin");
  // var NewUser = document.getElementById("newuser");
  // var SignInForm = document.getElementById("signin-form");
  // var NewUserForm = document.getElementById("newuser-form");
}
