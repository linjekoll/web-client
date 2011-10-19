App.models.Line = Backbone.Model.extend({
  initialize: function() {
    this.vehicles = new App.models.Vehicles();
    _.bindAll(this);
  },

  urlRoot: "/lines",

  /*
    Downloads and populates the stops attribute
  */
  populateStops: function() {
    var provider, id, stops;
    App.globals.logger("Running method Line#selfLoaded.");

    id = this.get("id");
    stops = new App.models.Stops({
      model: App.models.Stop,
      id: id
    });

    this.set({
      stops: stops
    });

    stops.bind("reset", this.stopsLoaded, this);
    stops.fetch();
  },

  /*
    Fires when all stops are loaded
  */
  stopsLoaded: function() {
    App.globals.logger("Running method Line#stopsLoaded, this should trigger socket connection");

    /* Calculate total time, now that the collection has been populated */
    this.calculateTotalTime();
    this.trigger("didFetch");

    /* Subscribing to websocket channel */
    App.globals.socket.send("subscribe.trip.update", [{
      provider_id: this.get("provider"),
      line_id: this.get("id")
    }]);
  },

  calculateTotalTime: function() {
    var totalTime = this.get("stops").reduce(function(memo, stop) {
      return stop.get("time") + memo;
    }, 0);
    
    this.set({ totalTime: totalTime });
    return this;
  },

  /*
   @json Hash A websocket data
   Example: 
   {
     alert_message: ""
     arrival_time: "1319041551"
     event: "did_leave_station"
     journey_id: "70"
     line_id: "4"
     next_station: "898345"
     previous_station: "8998235"
     provider_id: "1"
     station_id: "00012140"
   }
  */
  setMessage: function(json) {
    if (json.event === 'did_leave_station') {
      this.trigger("didLeaveStation", json);
    } else if (json.event === 'update') {
      this.update(json);
    } else if (json.event === 'alert') {
      this.alert(json);
    }
  },

  /* 
    @data Hash websocket data 
    Take a look at the Line#update
    for more information.
  */
  alert: function(data) {
    App.globals.logger("alert event triggered.");
  },

  /*
     *  If vehicle is present, set a new trip. Otherwise, create a new vehicle and .
     */
  update: function(message) {
    var stops = this.get("stops");
    var vehicle = this.vehicles.get(message.journey_id);
    var next = stops.get(message.next_station);

    if (!vehicle) {
      // TODO: place vehicle at correct position
    } else {
      vehicle.setTrip({
        time: message.time,
        destination: {
          x: next.get("pixelX"),
          y: next.get("pixelY")
        }
      });
    }
  }
});