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
  
  /* 
    Trigged by the socket sending data
    @data Hash An update object.
    It (@data) should look something like this;
    {
      alert_message: ""
      arrival_time: "1319031890"
      event: "did_leave_station"
      journey_id: "30"
      line_id: "4"
      next_station: "898345"
      previous_station: "8998235"
      provider_id: "1"
      station_id: "00012130"
    }
  */
  update: function(data){
    console.debug("============>", data);
    var line = window.lines.get(data.line_id)
    if(line) {
      var today = new Date();
      data.time = parseInt(data.arrival_time, 10) - (today.getTime() / 1000);
      line.setMessage(data);
    }
    
    App.globals.logger("Websocket update.trip event", data);
  },
  
  /*
    Called when the client (you) pushed invalid 
    data to the websocket server.
    
    @data Hash An error from the websocket server.
    The error should something like this:
    {
      message: "Invalid event.",
      ingoing: {}
    }
    
    The 'ingoing' key should contain data 
    that was pushed by you to the server.
  */
  error: function(data){
    App.globals.logger("Websocket error event", data);
  }
});