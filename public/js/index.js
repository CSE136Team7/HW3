function showDelete(e){window.location="#deleteModal"+e;var o=document.getElementById("delete-bookmark-form"+e);o.addEventListener("submit",function(e){var t=new FormData(o);console.log(JSON.stringify(t)),ajaxPost("/bookmarks/delete",t,function(){loadBookmarksList()}),e.preventDefault()},!1)}function loadBookmarksList(e){e?(currBooks=e,loadTemplate("booklist",{books:e}),loadTemplate("bookmodals",{books:e})):ajax("/bookmarks/getbooks/","GET",null,function(e){e.error&&(window.location="/login"),currBooks=e.books,debug(JSON.stringify(e)),loadTemplate("booklist",{books:e.books}),loadTemplate("bookmodals",{books:e.books})})}function sortBooks(){currBooks.sort(compareTitle),loadBookmarksList(currBooks)}function validate(e){return console.log("Textbox: "+e),""!==e}function validateURL(e){var o=new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return o.test(e)}function validateFile(){var e=document.forms.importForm.myFile.value,o="csv",t=e.split(".").pop();return o===t?(console.log("import successful!"),closeImportModal(),!0):(alert("not a valid csv file!"),!1)}function loadFoldersList(){ajax("/bookmarks/getfolders/","GET",null,function(e){e.error&&(window.location="/login"),loadTemplate("folderlist",e)})}function ajax(e,o,t,n){var a=new XMLHttpRequest;a.open(o,e,!0),a.onload=function(){if(a.status>=200&&a.status<400){var e,o=a.getResponseHeader("content-type")||"";e=o.indexOf("json")>=0?JSON.parse(a.responseText):a.responseText,n(e)}},t?(a.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),a.send(t)):a.send()}function loadTemplate(e,o){addToHistory(e,o),templatesCache[e]?displayTemplate(e,o):ajax("/views/"+e+".ejs","GET",null,function(t){templatesCache[e]=t,displayTemplate(e,o)})}function addToHistory(e,o){o=o||{},o.pageName=e,history.pushState(o,null,"/views/index.html#"+e)}function displayTemplate(e,o){var t=ejs.render(templatesCache[e],o);document.getElementById(e).innerHTML=t}function showAddModal(){document.getElementById("addModal").style.visibility="visible",document.getElementById("add-bookmark-form").reset()}function showAddFolderModal(){document.getElementById("folderModal").style.visibility="visible",document.getElementById("add-folder-form").reset()}function showImportModal(){document.getElementById("importBookmark").style.visibility="visible"}function closeAddModal(){var e=document.getElementById("bookTitle").value,o=document.getElementById("bookURL").value,t=document.getElementById("bookDescription").value;console.log("Title: "+e),console.log("URL: "+o),console.log("Description: "+t),console.log(validate(e)),console.log(validate(t)),validate(e)&&validateURL(o)&&validate(t)&&(document.getElementById("addModal").style.visibility="hidden")}function closeFolderAddModal(){var e=document.getElementById("Folder_input").value;validate(e)&&(document.getElementById("folderModal").style.visibility="hidden")}function closeImportModal(){document.getElementById("importBookmark").style.visibility="hidden",document.forms.importForm.myFile.value=""}function folderModaledit(e,o){ajax("/bookmarks/getbooks/","GET",null,function(t){loadTemplate("foldermodallist",{books:t.books,id:e,name:o})}),document.getElementById("folderModaledit").style.visibility="visible"}function addbookstoFolder(){var e=document.getElementById("update-folder-form");e.addEventListener("submit",function(o){var t=new FormData(e),n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status&&loadFoldersList()},n.open("POST","/addBookToFolder",!0),n.send(t),o.preventDefault()},!1),document.getElementById("folderModaledit").style.visibility="hidden"}function deleteBookmark(e){var o=document.getElementById("delete-bookmark-form"+e),t=new FormData(o);ajaxPost("/bookmarks/delete",t,function(){loadBookmarksList()})}function deleteFolders(e){var o=document.getElementById("delete-folder-form-"+e);if(o){var t=new FormData(o),n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status&&loadFoldersList()},n.open("POST","/deleteFolder",!0),n.send(t)}}function getFolders(e){console.log("i am inside folder"),ajax("/folders?fid="+e,"GET",null,function(e){console.log(e),loadTemplate("booklist",{books:e.books})})}function addListeners(){console.log("starring using Ajax");var e=document.getElementsByName("star");console.log(e.length);for(var o=0;o<e.length;++o)e[o].addEventListener("submit",function(e){var o=new FormData(this);console.log(JSON.stringify(o)),ajaxPost("/bookmarks/star",o,function(){loadBookmarksList(currBooks)}),e.preventDefault()},!1)}function getStarred(){ajax("/folder/starred","GET",null,function(e){loadTemplate("booklist",{books:e.books})})}function getMostVisited(){loadBookmarksList()}function ajaxPost(e,o,t){var n=new XMLHttpRequest;n.open("POST",e,!0),n.onreadystatechange=function(){4==n.readyState&&200==n.status&&t()},n.send(o)}function displayTemplate(e,o){var t=ejs.render(templatesCache[e],o);document.getElementById(e).innerHTML=t,"booklist"===e&&addListeners()}function addToHistory(e,o){o=o||{},o.pageName=e,history.pushState(o,null,"/views/index.html#"+e)}var debug=function(e){var o=1;o&&console.log(e)},currBooks=[],compareTitle=function(e,o){return e.Title.localeCompare(o.Title)},showEdit=function(e){console.log("Doesent work")},templatesCache=[];window.addEventListener("popstate",function(e){var o=e.state.pageName;displayTemplate(templatesCache[o],e.state)});var templatesCache=[];window.onload=function(){showEdit=function(e){window.location="#updateModal"+e;var o=document.getElementById("update-bookmark-form"+e);o.addEventListener("submit",function(e){var t=new FormData(o);console.log(JSON.stringify(t)),ajaxPost("/bookmarks/update",t,function(){loadBookmarksList()}),e.preventDefault()},!1)},loadBookmarksList(),loadFoldersList();var e=document.getElementById("add-bookmark-form"),o=document.getElementById("add-folder-form"),t=document.getElementById("search-form");t.addEventListener("submit",function(e){var o=document.forms["search-form"].searchbox.value;console.log("hello"),ajax("/find?searchbox="+o,"GET",null,function(e){loadBookmarksList(e)}),e.preventDefault()},!1),e.addEventListener("submit",function(o){var t=new FormData(e);ajaxPost("/bookmarks/insert",t,function(){loadBookmarksList()}),o.preventDefault()},!1),o.addEventListener("submit",function(e){var t=new FormData(o),n=new XMLHttpRequest;n.onreadystatechange=function(){4==n.readyState&&200==n.status&&loadFoldersList()},n.open("POST","/createFolder",!0),n.send(t),e.preventDefault()},!1);var n=document.getElementById("import");n.addEventListener("submit",function(e){var o=new FormData(n);validateFile()&&ajaxPost("/bookmarks/import",o,function(){loadBookmarksList()}),e.preventDefault()},!1);var a=document.getElementById("menu"),l=document.getElementById("sidebar");document.getElementById("menu-icon"),document.getElementById("trigger-submit");a.onclick=function(){var e=document.getElementById("right");"none"!==l.style.display?(l.style.display="none",e.style.width="100%",a.style.color="#FFF"):(l.style.display="block",e.style.width="82%",a.style.color="#FF9EAE")}};
