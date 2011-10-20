App.views.Vehicle = Backbone.View.extend({
  
  /*
   *  Parameters: shape - a Raphael shape that represents the vehicle
   */ 
  initialize: function() {
    _.bindAll(this);
    
    this.model.bind('change:time', this.timeDidChange);
    this.model.bind('change:trip', this.tripDidChange);
    this.model.bind("change:coordinates", this.moveTo);

    this.shape = this.options.shape;
    
    this.shape.attr({
      fill: "red"
    });
  },
  
  timeDidChange: function() {
    App.globals.logger("VehicleView#timeDidChange was triggered.");
    if (this.movementAnimation) {
      this.movementAnimation.ms = this.model.get("time")*1000;
      return this.start();
    } else {
      return this;
    }
  },

  tripDidChange: function() {
    App.globals.logger("VehicleView#tripDidChange was triggered.");
    var destination = this.model.get("destination");
    var time = this.model.get('time')*1000;
    var self = this;
    var movementAnimation = Raphael.animation({
      cx: destination.x,
      cy: destination.y
    },
    time, "linear", function() {
      var endStations = this.data("end_stations");
      var nextStation = self.model.get("next_station");
      
      for (var i=0; i < endStations.length; i++) {
        /* Type casting FTW */
        if(endStations[i] == nextStation){
          /* We should remove vehicle when we're in the end */
          self.shape.remove();
        }
      };
    });
    this.movementAnimation = movementAnimation;
    this.start();
    App.globals.logger("VehicleView: animation: ", movementAnimation);
    return this;
  },
  
  start: function() {
    console.debug("=========>", this.movementAnimation);
    this.shape.stop().
      data("end_stations", this.model.
      get("end_stations")).
      animate(this.movementAnimation);
      
    return this;
  },

  moveTo: function() {
    App.globals.logger("VehicleView#moveTo was triggered");
    var coordinates = this.model.get("coordinates");

    this.shape.stop().attr({
      cx: coordinates.x,
      cy: coordinates.y
    });

    return this;
  },

  remove: function() {
    this.shape.hide();
    return this;
  }
});