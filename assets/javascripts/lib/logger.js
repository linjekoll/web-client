/*
  @title String First argument to logger, default is "Logger"
  @message Object Data that should be printed in the console.
  
  Example:
    App.globals.logger(randomObject);
    # => "Logger", randomObject
    
    App.globals.logger("My custom title", randomObject);
    # => "My custom title", randomObject
*/
App.globals.logger = function(title, message) {
  if(console && typeof(console.log) === "function"){
    if(!message){
      message = title; title = "Logger";
    }
    
    console.debug(title, message);
  }
};