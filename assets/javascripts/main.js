/* 
  Ower own Websocket class.
  Take a look the lib/dispatch.js file for more info
*/
App.globals.socket = new DispatchSocket("ws://46.16.232.244:3333");

/* Creating a container for all lines */
window.lines = new App.models.Lines();

//= require "lib/funfunfun"
$(function() {
  $.get("/static/line.template.html", function(data) {
    $("#line-template").html(data);
  });
  
  $("#lines li").click(function() {
    var $self, providerId, lineId;
    
    $self      = $(this);
    providerId = $self.data("provider-id");
    lineId     = $self.data("line-id");
    
    var line = lines.get(lineId);
    
    line.populateStops();
    
    var lineView = new App.views.Line({
      model: line
    });
    
    line.set({
      view: lineView
    })
        
    App.globals.logger("Subscribing to line id " + lineId + " with provider id " + providerId);
  });
  
  lines.fetch();
});

App.globals.gateKeeper = new App.models.GateKepper();