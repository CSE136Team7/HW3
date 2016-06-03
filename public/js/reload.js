var oReq = new XMLHttpRequest();
oReq.onreadystatechange = function() {
  if (oReq.readyState == 4 && oReq.status == 200) {
    console.log("Server knows you turned on your js");
  }
};
oReq.open("GET", "/home?js=1", true);
oReq.send();
window.location = '/views/index.html';
