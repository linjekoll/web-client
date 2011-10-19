App.models.Line = Backbone.Model.extend({
  initialize: function() {
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
    },
    0);
    this.set({
      totalTime: totalTime
    });
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
      this.didLeaveStation(json);
    } else if (json.event === 'update') {
      this.update(json);
    } else if (json.event === 'alert') {
      this.alert(json);
    }
  },

  didLeaveStation: function(message) {
    var stops = this.get("stops");
    var vehicle = vehicles.get(message.journey_id);
    var paper = this.paper;
    var previous = stops.get(message.previous_station);
    var next = stops.get(message.next_station);

    /* 
       *  If no vehicle was found, we should create it, 
       */
    if (!vehicle) {
      var vehicle = new App.models.Vehicle();
      var shape = this.paper.circle(previous.get("pixelX"), previous.get("pixelY"));
      shape.attr({
        fill: "black"
      });
      var vehicleView = new App.views.Vehicle({
        model: vehicle,
        shape: shape
      });
    }

    vehicle.moveTo(previous.get("pixelX"), previous.get("pixelY"));
    vehicle.setTrip({
      time: message.time,
      destination: {
        x: next.get("pixelX"),
        y: next.get("pixelY")
      }
    });

    return this;
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
    @data Hash websocket data 
    Take a look at the Line#update
    for more information.
  */
  didLeaveStation: function(message) {
    App.globals.logger("didLeaveStation event triggered.");
    App.globals.logger(message);
    return;

    var stops = this.get("stops");
    var vehicle = vehicles.get(message.journey_id);
    var paper = this.paper;
    var previous = stops.get(message.previous_station);
    var next = stops.get(message.next_station);

    /* 
       *  If no vehicle was found, we should create it
       */
    if (!vehicle) {
      var vehicle = new App.models.Vehicle();
      var shape = this.getShape({
        x: previous.get("pixelX"),
        y: previous.get("pixelY")
      });
      var vehicleView = new App.views.Vehicle({
        model: vehicle,
        shape: shape
      });
    }

    vehicle.moveTo(previous.get("pixelX"), previous.get("pixelY"));
    vehicle.setTrip({
      time: message.time,
      destination: {
        x: next.get("pixelX"),
        y: next.get("pixelY")
      }
    });

    return this;
  },

  /*
     *  If vehicle is present, set a new trip. Otherwise, create a new vehicle and .
     */
  update: function(message) {
    var stops = this.get("stops");
    var vehicle = vehicles.get(message.journey_id);
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
  },

  getShape: function(options) {
    return this.paper.circle(options.x, options.y).attr({
      fill: "black"
    });
  }
});