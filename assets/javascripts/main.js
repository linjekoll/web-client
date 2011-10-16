var line = new App.models.Line({name: "4", id: 4});
var lineView = new App.views.Line({model: line});

$(function() {
  console.log("Hej!");
  $("#outer").append(lineView.render().el);
});