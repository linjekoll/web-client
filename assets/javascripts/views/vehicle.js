App.views.Vehicle = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, ['render', 'timeDidChange', 'tripDidChange', 'start', 'moveTo', 'remove']);
    this.options.model.bind('change:time', 'timeDidChange');
    this.options.model.bind('change:trip', 'tripDidChange');
    this.shape = options.shape;
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
  moveTo: function(x, y) {
    return this.get("shape").stop().attr({cx: x, cy: y});
  },
  remove: function() {
    return this.get("shape").hide();
  }
});