/*
  Example usage: lineView = new App.views.Line({model: line});
*/

App.views.Line = Backbone.View.extend({
  tag: "div",
  className: "line",
  initialize: function() {
    this.model.bind('didFetch', this.modelDidFetch, this);
    _.bindAll(this);
  },
  
  modelDidFetch: function() {
    console.log("Reset!");
    // Set id of element to reflect id of line
    $(this.el).attr({id: this.model.id});
    
    this.yOffset = 150
    this.xOffset = 80;
    
    this.stopViews = [];
    
    _.bindAll(this);
    
    this.template = _.template($("#line-template").html());
    this.render();
  },
  
  render: function() {
    console.log("Render!");
    // Render HTML
    console.log(this.model.toJSON());
    var rendered = this.template(this.model.toJSON());
    $(this.el).html(rendered);
    $("#outer").append(this.el);
    
    // Prepare Raphael
    this.paper = Raphael(this.$(".canvas").get(0));
    this.width = $(this.el).width();
    this.path = this.paper.path("M " + this.xOffset + " " + this.yOffset + "L " + (this.width - this.xOffset) + " " + this.yOffset);
    this.path.attr({"stroke-width": 4, "stroke-linecap": "round"});
    
    this.drawStops();
    return this;
  },
  
  drawStops: function() {
    var totalTime = this.model.get("totalTime");
    var cumulativeTimes = [];
    var stops = this.model.get("stops");
    var totalWidth = this.width - (2*this.xOffset);
    var stopViews = this.stopViews;
    var paper = this.paper;
    var xOffset = this.xOffset;
    var yOffset = this.yOffset;
    
    // Make an array of hashes {stop: aStop, cumulativeTime: timeFromFirstStationToThisStation}
    stops.reduce(function(cumulative, stop) {
      cumulativeTimes.push({stop: stop, cumulativeTime: cumulative});
      return cumulative + stop.get("time");
    },0);
    
    // Make an array of hashes {stop: aStop, xCoord, theXCoordinateOfTheStop}
    var stopsAndCoords = _.map(cumulativeTimes, function(stopAndTime) {
      var factor = stopAndTime.cumulativeTime / totalTime;
      var xCoord = Math.round(factor * totalWidth) + xOffset;
      return {stop: stopAndTime.stop, xCoord: xCoord};
    });
    
    // Create the views, save pixel coordinates in the model
    _.each(stopsAndCoords, function(stopAndCoord) {
      stopAndCoord.stop.set({pixelX: stopAndCoord.xCoord, pixelY: yOffset});
      var stopView = new App.views.Stop({model: stopAndCoord.stop, x: stopAndCoord.xCoord, y: yOffset, paper: paper});
      stopViews.push(stopView);
    });
  }
});