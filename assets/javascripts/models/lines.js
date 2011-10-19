App.models.Lines = Backbone.Collection.extend({
  model: App.models.Line,
  url: function(){
    return "/lines?amount=30";
  }
});