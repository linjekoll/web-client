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
  
  var template = _.template('<li data-provider-id="1" data-line-id="<%= id %>"><%= name %></li>');    
  var items = $("#lines");
  
  $("#search-result li").live("click", function() {
    var list_ids = eval("[" + $(this).data("line-ids") + "]");
    items.empty();
    _.each(list_ids, function(line_id) {
      var line = new App.models.Line({
        id: line_id
      }).fetch({
        success: function(model) {
         var data = template({
           id: model.get("id"),
           name: model.get("name")
         });
         
         items.append(data);
        }
      })      
    });
  });
  
  $("#lines li").live("click", function() {
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