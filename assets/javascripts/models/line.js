App.models.Line = Backbone.Model.extend({
  initialize: function() {
    this.stops = new App.models.Stops({id: this.id});
    this.stops.fetch();
  }
});