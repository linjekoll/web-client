App.models.Line = Backbone.Collection.extend({
  model: App.models.Stop,
  initialize: function(params) {
    this.id = params.id;
  },
  url: function () {
    return "/lines/" + this.id + "/" + "stops";
  }
});