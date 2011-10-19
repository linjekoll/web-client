/*
  Example usage: lineView = new App.views.Line({model: line});
*/

App.views.Line = Backbone.View.extend({
  tag: "div",
  className: "line",
  initialize: function() {
    this.model.bind("didFetch", this.modelDidFetch, this);
    this.bind("doneRendering", this.doneRendering, this);
    this.model.bind("didLeaveStation", this.didLeaveStation, this);
    _.bindAll(this);
  },

  doneRendering: function() {
    App.globals.logger("Running LineView#doneRendering");
  },

  modelDidFetch: function() {
    console.log("Reset!");
    // Set id of element to reflect id of line
    $(this.el).attr({
      id: this.model.id
    });

    this.yOffset = 150
    this.xOffset = 80;

    this.stopViews = [];

    _.bindAll(this);

    this.template = _.template($("#line-template").html());
    this.render();
  },

  render: function() {
    App.globals.logger("LineView was triggered.");
    
    var rendered = this.template(this.model.toJSON());
    $(this.el).html(rendered);
    $("#outer").append(this.el);

    /* Initializes raphael.js */
    this.paper = Raphael(this.$(".canvas").get(0));
    this.width = $(this.el).width();
    this.path = this.paper.path("M " + this.xOffset + " " + this.yOffset + "L " + (this.width - this.xOffset) + " " + this.yOffset);
    this.path.attr({
      "stroke-width": 4,
      "stroke-linecap": "round"
    });

    this.drawStops();

    this.trigger("doneRendering");

    return this;
  },

  drawStops: function() {
    /*
      @totalTime Integer The time it takes to move from one end to the other.
      @cumulativeTimes Array ....
      @stops Array A list of stops, each stop is a backbone model object.
      @totalWidth Integer With of the canvas. This is uniqe for each user.
      @stopViews Array An array of stop view. Each view is a backbone view object.
      @paper Raphael A raphael canvas object.
      @xOffset Integer Space in pixles between line and canvas.
      @yOffset Integer Space in pixles between line and canvas.
    */
    
    var totalTime       = this.model.get("totalTime");
    var cumulativeTimes = [];
    var stops           = this.model.get("stops");
    var totalWidth      = this.width - (2 * this.xOffset);
    var stopViews       = this.stopViews;
    var paper           = this.paper;
    var xOffset         = this.xOffset;
    var yOffset         = this.yOffset;

    /* Make an array of hashes {stop: aStop, cumulativeTime: timeFromFirstStationToThisStation} */
    stops.reduce(function(cumulative, stop) {
      cumulativeTimes.push({
        stop: stop,
        cumulativeTime: cumulative
      });
      return cumulative + stop.get("time");
    },
    0);

    /* Make an array of hashes {stop: aStop, xCoord, theXCoordinateOfTheStop} */
    var stopsAndCoords = _.map(cumulativeTimes, function(stopAndTime) {
      var factor = stopAndTime.cumulativeTime / totalTime;
      var xCoord = Math.round(factor * totalWidth) + xOffset;
      return {
        stop: stopAndTime.stop,
        xCoord: xCoord
      };
    });

    /* Create the views, save pixel coordinates in the model */
    _.each(stopsAndCoords, function(stopAndCoord) {
      stopAndCoord.stop.set({
        pixelX: stopAndCoord.xCoord,
        pixelY: yOffset
      });
      var stopView = new App.views.Stop({
        model: stopAndCoord.stop,
        x: stopAndCoord.xCoord,
        y: yOffset,
        paper: paper
      });
      stopViews.push(stopView);
    });
  },

  /* 
    @data Hash websocket data 
    Take a look at the Line#update
    for more information.
  */
  didLeaveStation: function(message) {
    App.globals.logger("LineView#didLeaveStation event triggered.");
    App.globals.logger(message);

    var stops = this.model.get("stops");
    var vehicle = this.model.vehicles.get(message.journey_id);
    var paper = this.paper;
    var previous = stops.get(message.previous_station);
    var next = stops.get(message.next_station);

    /* 
    *  If no vehicle was found, we should create it
    */
    if (!vehicle) {
      var vehicle = new App.models.Vehicle({
        pixelX: previous.get("pixelX"),
        pixelY: previous.get("pixelY")
      });

      var shape = this.getShape({
        x: previous.get("pixelX"),
        y: previous.get("pixelY")
      });

      /* 
        Let's create a Vehicle view
        - A vehicle should be able to figure out
        when it's on the end station, therefore
        we pass an end stations array.
        The end station array should contain a list of end
        stations.
        
        @this.get("end_stations") => [1,2]
      */
      var vehicleView = new App.views.Vehicle({
        model: vehicle,
        shape: shape,
        end_stations: this.model.get("end_stations")
      });
    }

    vehicle.set({
      coordinates: {
        x: previous.get("pixelX"),
        y: previous.get("pixelY")
      }
    });

    vehicle.setTrip({
      time: message.time,
      destination: {
        x: next.get("pixelX"),
        y: next.get("pixelY")
      }
    });

    return this;
  },

  getShape: function(options) {
    return this.paper.circle(options.x, options.y).attr({
      fill: "black"
    });
  }
});