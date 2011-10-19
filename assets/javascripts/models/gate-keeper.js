/*
What should this model do? 
- Receive data from the websocket connect
- If the event is an trip.update;
  - Select the given station from the stations collection
  - Pass data to the found station
  - If no station is found, throw the data away
- Otherwise; do nothing
- Log everything
*/

App.models.GateKepper = Backbone.Model.extend({
  initialize: function() {
    App.globals.socket.bind("update.trip", this.update);
    App.globals.socket.bind("error", this.error);
  },
  
  /* Trigged by the socket sending data */
  update: function(data){
    console.debug("NEW DATA", data);
  },
  
  error: function(data){
    console.debug("Error", data);
  }
});