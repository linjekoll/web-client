App.models.Line = Backbone.Collection.extend({
  model: App.models.Stop,
  url: "/Stops" + this.id
});