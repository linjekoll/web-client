App.models.Vehicle = Backbone.Model.extend({
  moveTo: function(x, y) {
    return this.get("shape").stop().attr({cx: x, cy: y});
  },
  remove: function() {
    return this.get("shape").hide();
  }
});