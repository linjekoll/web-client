/* 
  Ower own Websocket class.
  Take a look the lib/dispatch.js file for more info
*/
App.globals.socket = new DispatchSocket("ws://46.16.232.244:3333");

/* Creating a container for all lines */
window.lines = new App.models.Lines();

//= require "lib/funfunfun"
$(function() {
  $("#4").click(function() {
    App.globals.socket.send("subscribe.trip.update", [{
      provider_id: 1,
      line_id: "4"
    }])
  });
  
  lines.add(new App.models.Line({
    id: 4
  }));
});

App.globals.gateKeeper = new App.models.GateKepper();