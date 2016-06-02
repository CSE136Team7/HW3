// Debug Module for printing debug statements
var debug = 1;

var fs = require('fs');
var count = 0;

module.exports.print = function(stmt){
  if(debug){
    console.log(stmt);
  }
  count = count + 1;
  fs.writeFile("/tmp/test", ("Hey there!"+count), function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");

  });
}

module.exports.print2 = function(stmt, unpack){
  if(debug){
    console.log(stmt, unpack);
  }
}
