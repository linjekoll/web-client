App.models.Lines = Backbone.Collection.extend({
  model: App.models.Line,
  url: function(){
    return "/lineart-enterprise-app-web/rest/lines?amount=30";
  }
});