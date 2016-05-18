window.onload = function() {
	var SignIn = document.getElementById("signin");
var NewUser = document.getElementById("newuser");
var SignInForm = document.getElementById("signin-form");
var NewUserForm = document.getElementById("newuser-form");


SignIn.onclick = function() {
	NewUserForm.style.display = 'none';
	SignInForm.style.display = 'block';

	NewUser.className = "";

	SignIn.className = "";
	SignIn.className = "is-active";

}

NewUser.onclick = function() {
	SignInForm.style.display = 'none';
	NewUserForm.style.display = 'block';

	SignIn.className = "";

	NewUser.className = "";
	NewUser.className = "is-active";
}
}