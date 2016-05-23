// var mysql      = require('mysql');
// var config = require('./config');
//
// var MySQL = function() {
//     var connection;
//
//     return {
//         init: function(){
//             MySQL.connection = mysql.createConnection('mysql://bf10eaf95350d6:d8fcd7ae@us-cdbr-iron-east-04.cleardb.net/heroku_3ddd6cbd9fad3cb?reconnect=true');
//             MySQL.connection.connect();
//         },
//         query: function(querystring, callback){
//             MySQL.connection.query(querystring, callback);
//         },
//         escape: mysql.escape
//     }
// }();
//
// module.exports = MySQL;

var mysql      = require('mysql');
var config = require('./config');

var MySQL = function() {
    var connection;

    return {
        init: function(){
            MySQL.connection = mysql.createConnection('mysql://bf10eaf95350d6:d8fcd7ae@us-cdbr-iron-east-04.cleardb.net/heroku_3ddd6cbd9fad3cb?reconnect=true');
            MySQL.connection.connect(function(err) {              // The server is either down
                if(err) {                                     // or restarting (takes a while sometimes).
                  console.log('error when connecting to db:', err);
                  setTimeout(MySQL, 2000); // We introduce a delay before attempting to reconnect,
                }                                     // to avoid a hot loop, and to allow our node script to
              });

              MySQL.connection.on('error', function(err) {
                console.log('db error', err);
                if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
                  MySQL();                         // lost due to either server restart, or a
                } else {                                      // connnection idle timeout (the wait_timeout
                  throw err;                                  // server variable configures this)
                }
              });
        },
        query: function(querystring, callback){
            MySQL.connection.query(querystring, callback);
        },
        escape: mysql.escape
    }
}();

module.exports = MySQL;
