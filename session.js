// Session.js
var session = require('express-session');
var db = require('./db');
var debug = require('./debug');

// Return a new session or
module.exports.create = function(user_ID) {
    debug.print("Received create session request.\n");

}

// update
module.exports.update = function(sessionID) {
    debug.print("Received update session request.\n");


  }

module.exports.validate = function(sessionID){
    debug.print("Received validation session request.\n");

}

// delete
module.exports.invalidate = function(sessionID) {
    debug.print("Received invalidate session request.\n");

}
