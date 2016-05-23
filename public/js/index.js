window.onload = function() {
  var form = document.getElementById("import");
  form.addEventListener('submit', function(ev) {
    var oData = new FormData(form);
    console.log("form submitted");
    var oReq = new XMLHttpRequest();
    oReq.open("POST", "/bookmarks/import", true);
    oReq.onload = function(oEvent) {
      console.log(oReq.status);
  };
  console.log(oData);
  console.log(form);
  oReq.send(oData);
    ev.preventDefault();
  }, false);
//
// var menuButton = document.getElementById("menu");
// var sidebar = document.getElementById("sidebar");
// var menuIcon = document.getElementById("menu-icon");
// var triggerSubmit = document.getElementById("trigger-submit");
//
// menuButton.onclick = function() {
// 	var right = document.getElementById("right");
// 	if(sidebar.style.display !== 'none'){
// 		sidebar.style.display = 'none';
// 		right.style.width = '100%';
// 		menuButton.style.color = "#FFF";
// 	}
// 	else {
// 		sidebar.style.display = 'block';
// 		right.style.width = '82%';
// 		menuButton.style.color = "#FF9EAE";
// 	}
// };
//
// var addBookmark = document.getElementById("add-bookmark");
// var importBookmark = document.getElementById("import-bookmark");
// var addBookmarkForm = document.getElementById("add-bookmark-form");
// var importBookmarkForm = document.getElementById("import-bookmark-form");
//
// var SignIn = document.getElementById("signin");
// var NewUser = document.getElementById("newuser");
// var SignInForm = document.getElementById("signin-form");
// var NewUserForm = document.getElementById("newuser-form");
//
//
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
//
}
