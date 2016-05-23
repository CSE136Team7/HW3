var mysql      = require('mysql');
var config = require('./config');

var MySQL = function() {
    var connection;

    return {
        init: function(){
            MySQL.connection = mysql.createConnection('mysql://bf10eaf95350d6:d8fcd7ae@us-cdbr-iron-east-04.cleardb.net/heroku_3ddd6cbd9fad3cb?reconnect=true');
            MySQL.connection.connect();
        },
        query: function(querystring, callback){
            MySQL.connection.query(querystring, callback);
        },
        escape: mysql.escape
    }
}();

module.exports = MySQL;
