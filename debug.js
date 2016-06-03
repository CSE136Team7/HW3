// Debug Module for printing debug statements
var debug = 1;
var version = 'Hw5 submission heroku live';

var fs = require('fs');

var now = (function () {
  var year = new Date(new Date().getFullYear().toString()).getTime();
  return function () {
    return Date.now() - year
  }
})();

module.exports.print = function(stmt){
  if(debug){
    console.log(stmt);
  }

  var logstmt = '\n[' + stmt + ']@time[' + now() + ']@ver['+ version +']';

  fs.appendFile('log.txt', (logstmt), function (err) {
      if(err) {
        return console.log(err);
      }
  });


}

module.exports.print2 = function(stmt, unpack){
  if(debug){
    console.log(stmt, unpack);
  }
}
