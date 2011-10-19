App.views.Vehicle = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this);
    this.model.bind('change:time', this.timeDidChange);
    this.model.bind('change:trip', this.tripDidChange);
    this.model.bind("change:coordinates", this.moveTo);
    
    this.shape = this.options.shape;
    this.shape.attr({
      fill: "#FFFFFF"
    });

    this.pulseAnimation = Raphael.animation({
      fill: "red"
    },
    2000, function() {
      this.attr({
        fill: "#FFFFFF"
      })
    }).repeat(4999);

    /* 
      This should be printed
    */
    App.globals.logger("this.options", this.options);
  },  
  render: function() {

  },
  
  timeDidChange: function() {
    console.log("timeDidChange!");
    if (this.movementAnimation) {
      this.movementAnimation.ms = this.model.get("time");
      return this.start();
    } else {
      return this;
    }
  },
  
  tripDidChange: function() {
    console.log("Trip did change!");
    var destination = this.model.get("destination");
    var time = this.model.get('time');
    var movementAnimation = Raphael.animation({
      cx: destination.x,
      cy: destination.y
    },
    time);
    this.movementAnimation = movementAnimation;
    this.shape.stop().animate(movementAnimation).animate(this.pulseAnimation);
    return this;
  },
  
  start: function() {
    this.shape.stop().animate(this.movementAnimation).animate(this.pulseAnimation);
    return this;
  },

  moveTo: function() {
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