App.models.Stops = Backbone.Collection.extend({
  initialize: function(params) {
    this.id = params.id;
  },
  // model: App.models.Stop,
  url: function () {
    return "/lines/" + this.id + "/" + "stops";
  }
});