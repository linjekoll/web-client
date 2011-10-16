App.models.Line = Backbone.Collection.extend({
  model: App.models.Stop,
  url: function () {
    return "/lines/" + this.id + "/" + "stops";
  }
});