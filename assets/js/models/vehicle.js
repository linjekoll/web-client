App.models.Vehicle = Backbone.Model.extend({
  
  /* Constructor
   * arg: shape - Raphael element to be animated
   */
  initialize: function(shape) {
    this.set({shape: shape});
    this.get("shape").hover(function() {
      this.glow({width: 10});
    });
  },
  startTowards: function(x,y) {
    this.set({dest_x: x});
    this.set({dest_y: y});
    var animation = Raphael.animation({cx: x, cy: y}, 50000);
    this.set({animation: animation});
    this.get("shape").animate(animation);
    return this;
  },
  start: function() {
    this.get("shape").stop().animate(this.get("animation"));
    return this;
  },
  setNewTime: function(time) {
    this.get("animation").ms = time;
    return this.start();
  },
  moveTo: function(x, y) {
    return this.get("shape").stop().attr({cx: x, cy: y});
  },
  remove: function() {
    return this.get("shape").hide();
  }
});