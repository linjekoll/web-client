App.models.Line = Backbone.Model.extend({
    initialize: function() {
      var self = this;
      var vehicles = new App.models.Vehicles();
      this.set({vehicles: vehicles});
      this.fetch({success: function(model, response) {
        model.selfLoaded();
      }});
    },
    
    selfLoaded: function() {
      console.log("selfLoaded: ", this);
      id = this.get("id");
      var stops = new App.models.Stops({
          model: App.models.Stop,
          id: id
      });
      // store the stops, and then bind to the event
      this.set({stops: stops});
      stops.bind("reset", this.stopsLoaded, this);
      stops.fetch();
    },
    
    urlRoot: "/lines",

    stopsLoaded: function(){
        console.log("Stops loaded!");
        // Calculate total time, now that the collection has been populated
        this.calculateTotalTime();
        console.log(this.get("stops"));
        this.trigger('didFetch');
    },

    calculateTotalTime: function() {
        var totalTime = this.get("stops").reduce(function(memo, stop) {
            return stop.get("time") + memo;
        }, 0);
        this.set({totalTime: totalTime});
        return this;
    },
    
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
       *  If no vehicle was found, we should create it
       */
      if (!vehicle) {
        var vehicle = new App.models.Vehicle();
        var shape = this.getShape({x: previous.get("pixelX"),y: previous.get("pixelY")});
        var vehicleView = new App.views.Vehicle({model: vehicle, shape: shape});
      }
      
      vehicle.moveTo(previous.get("pixelX"), previous.get("pixelY"));
      vehicle.setTrip({time: message.time, destination: {x: next.get("pixelX"), y: next.get("pixelY")}});
      
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
        vehicle.setTrip({time: message.time, destination: {x: next.get("pixelX"), y: next.get("pixelY")}});
      }
    },
    
    alert: function() {
      
    }
    
    getShape: function(options) {
      return this.paper.circle(options.x, options.y).attr({fill: "black"});
    }
});