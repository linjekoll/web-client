App.views.Vehicle = Backbone.View.extend({
  initialize: function(shape) {
    _.bindAll(this, ['render', 'timeDidChange', 'tripDidChange', 'start']);
    this.model.bind('change:time', 'timeDidChange');
    this.model.bind('change:trip', 'tripDidChange');
    this.shape = shape;
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
    var trip = this.model.get("trip");
    var animation = Raphael.animation({cx: trip.x, cy: trip.y}, trip.time);
    this.animation = animation;
    this.shape.animate(animation);
    return this;
  },
  start: function() {
    this.shape.stop().animate(this.animation);
    return this;
  },
});