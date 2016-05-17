// Debug Module for printing debug statements
var debug = 0;

module.exports.print = function(stmt){
  if(debug){
    console.log(stmt);
  }
}
module.exports.print2 = function(stmt, unpack){
  if(debug){
    console.log(stmt, unpack);
  }
}
