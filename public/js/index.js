var debug = function(s) {
  var bool = 1;
  if(bool) {
    console.log(s);
  }
}

function showAddModal() {
  console.log("clearing in field: -----------------------===>>>"+document.getElementById("addModal"));
    document.getElementById("addModal").style.visibility = "visible";
    document.getElementById("folderModal").style.visibility = "visible";
    document.getElementById("add-bookmark-form").reset();
    document.getElementById("add-folder-form").reset();
}

function closeAddModal() {
    document.getElementById("addModal").style.visibility = "hidden";
    document.getElementById("folderModal").style.visibility = "hidden";
}

window.onload = function() {
  loadBookmarksList();
  loadFoldersList();
  /**
     *  Uses Ajax to get the book list data from the server.
     */

    function loadBookmarksList() {

        ajax('/bookmarks/getbooks/', 'GET', null, function(books) {
            debug(JSON.stringify(books));
            console.log("books:--------------------->"+JSON.stringify(books.books));
            loadTemplate('booklist', {books : books.books});
        });
    }

    function loadFoldersList() {
      ajax('/bookmarks/getfolders/', 'GET', null, function(folders) {
        console.log("books:--------------------->"+JSON.stringify(folders));
          loadTemplate('folderlist', folders);
      });
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

  /**
     * Short, generic Ajax function to avoid jquery usage
     */
    function ajax(url, method, data, callback){
        var request = new XMLHttpRequest();
        request.open(method, url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var contentType = request.getResponseHeader('content-type') || '';
                var response;

                if (contentType.indexOf('json') >= 0){
                    response = JSON.parse(request.responseText);
                }
                else{
                    response = request.responseText;
                }

                callback(response);
            }
        };

        if (data){
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.send(data);
        }
        else {
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
    function loadTemplate(name, data){
        addToHistory(name, data);

        if (templatesCache[name]){
            displayTemplate(name, data);
        }
        else{
            ajax('/views/' + name + '.ejs', 'GET', null, function (template) {
              console.log(template);
                templatesCache[name] = template;
                displayTemplate(name, data);
            });
        }
    }

  function addToHistory(name, data){
        data = data || {};
        data.pageName = name;
        history.pushState(data, null, "/views/index.html#" + name);
     }

  var addBookForm = document.getElementById("add-bookmark-form");
  var createFolder = document.getElementById("add-folder-form");

  addBookForm.addEventListener('submit', function(ev) {
    var oData = new FormData(addBookForm);
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function () {
      if(oReq.readyState == 4 && oReq.status == 200) {
        loadBookmarksList();
      }
    };
    oReq.open("POST", "/bookmarks/insert", true);
    oReq.send(oData);
    ev.preventDefault();
  }, false);



  createFolder.addEventListener('submit', function(ev) {
    var oData = new FormData(createFolder);
    console.log("oData:---------------------->"+JSON.stringify(oData,null,4));
    var oReq = new XMLHttpRequest();
    oReq.onreadystatechange = function () {
      if(oReq.readyState == 4 && oReq.status == 200) {
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
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "/bookmarks/import", true);
    oReq.onload = function(oEvent) {
      console.log(oReq.status);
  };
  oReq.send(oData);
    ev.preventDefault();
  }, false);


  var importBookForm = document.getElementById("import");
  importBookForm.addEventListener('submit', function(ev) {
    var oData = new FormData(importBookForm);
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "/bookmarks/import", true);
    oReq.onload = function(oEvent) {
      console.log(oReq.status);
  };
  oReq.send(oData);
    ev.preventDefault();
  }, false);



var menuButton = document.getElementById("menu");
var sidebar = document.getElementById("sidebar");
var menuIcon = document.getElementById("menu-icon");
var triggerSubmit = document.getElementById("trigger-submit");

menuButton.onclick = function() {
	var right = document.getElementById("right");
	if(sidebar.style.display !== 'none'){
		sidebar.style.display = 'none';
		right.style.width = '100%';
		menuButton.style.color = "#FFF";
	}
	else {
		sidebar.style.display = 'block';
		right.style.width = '82%';
		menuButton.style.color = "#FF9EAE";
	}
};

var addBookmark = document.getElementById("add-bookmark");
var importBookmark = document.getElementById("import-bookmark");
var addBookmarkForm = document.getElementById("add-bookmark-form");
var importBookmarkForm = document.getElementById("import-bookmark-form");

var SignIn = document.getElementById("signin");
var NewUser = document.getElementById("newuser");
var SignInForm = document.getElementById("signin-form");
var NewUserForm = document.getElementById("newuser-form");


// SignIn.onclick = function() {
// 	NewUserForm.style.display = 'none';
// 	SignInForm.style.display = 'block';
//
// 	NewUser.className = "";
//
// 	SignIn.className = "";
// 	SignIn.className = "is-active";
//
// }
//
// NewUser.onclick = function() {
// 	SignInForm.style.display = 'none';
// 	NewUserForm.style.display = 'block';
//
// 	SignIn.className = "";
//
// 	NewUser.className = "";
// 	NewUser.className = "is-active";
// }
//
// addBookmark.onclick = function() {
// 	importBookmarkForm.style.display = 'none';
// 	addBookmarkForm.style.display = 'block';
//
// 	importBookmark.className = "";
//
// 	addBookmark.className = "";
// 	addBookmark.className = "is-active";
//
// }
//
// importBookmark.onclick = function() {
// 	addBookmarkForm.style.display = 'none';
// 	importBookmarkForm.style.display = 'block';
//
// 	addBookmark.className = "";
//
// 	importBookmark.className = "";
// 	importBookmark.className = "is-active";
// }
//
// triggerSubmit.onclick = function() {
// 	document.getElementById('hide-submit-btn').click();
// };

}
