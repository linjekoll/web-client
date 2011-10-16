App.views.Vehicle = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this);
    this.model.bind('change:time', this.timeDidChange);
    this.model.bind('change:trip', this.tripDidChange);
    this.shape = this.options.shape;
  },
  render: function() {
    
  },
  timeDidChange: function() {
    if (this.animation) {
      this.animation.ms = this.model.get("time");
      return this.start();
    } else {
      return this;
    }
  },
  tripDidChange: function () {
    console.log("Trip did change!");
    var destination = this.model.get("destination");
    var time = this.model.get('time');
    var animation = Raphael.animation({cx: destination.x, cy: destination.y}, time);
    this.animation = animation;
    this.shape.animate(animation);
    return this;
  },
  start: function() {
    this.shape.stop().animate(this.animation);
    return this;
  },
  moveTo: function(x, y) {
    return this.get("shape").stop().attr({cx: x, cy: y});
  },
  remove: function() {
    return this.get("shape").hide();
  }
});