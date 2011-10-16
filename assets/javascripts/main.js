var line = new App.models.Line({name: "4", id: 4});
var lineView = new App.views.Line({collection: line});

$(function() {
  console.log("Hej!");
  $("#outer").append(lineView.render().el);
});