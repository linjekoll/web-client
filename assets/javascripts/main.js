

window.v = function() {
  window.vm = new App.models.Vehicle();
  window.vv = new App.views.Vehicle({model: window.vm, shape: lineView.paper.circle(10,10,10)});
};

window.vstart = function() {
  window.vm.setTrip({time: 10000, destination: {x: 900, y:10}});
};

window.vnewtime = function (time) {
  window.vm.set({time: time});
};

window.stop = function () {
  window.stop2 = new App.models.Stop({x: 100, y:100, name: "Mölndal"});
  window.stop2View = new App.views.Stop({model: stop2, paper: window.lineView.paper});
  window.stop2View.render();
}

$(function() {
  $("#4").click(function() {
      window.line = new App.models.Line({id: 4});
      window.lineView = new App.views.Line({model: line});
  });
});