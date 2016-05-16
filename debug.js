// Debug Module for printing debug statements

var debug = 1;


module.exports.print = function(stmt){
  if(debug){
    console.log(stmt);
  }
}
