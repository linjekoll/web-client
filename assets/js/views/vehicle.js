App.views.Vehicle = Backbone.View.extend({
  initialize: function(shape) {
    _.bindAll(this, 'render');
    this.model.bind('change:time', 'newTime');
    this.shape = shape;
  },
});