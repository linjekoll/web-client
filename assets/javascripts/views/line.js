App.views.Line = Backbone.View.extend({
  tag: "div",
  className: "line",
  initialize: function() {
    // Set id of element to reflect id of line
    $(this.el).attr({id: this.collection.id});
    
    _.bindAll(this, 'render');
    this.collection.bind('change', this.render);
    this.template = _.template($("#line-template").html());
  },
  render: function() {
    var rendered = this.template(this.collection.toJSON());
    $(this.el).html(rendered);
    $("#outer").append(this.el);
    this.paper = this.paper || Raphael(this.$(".canvas").get(0));
    var width = $(this.el).width();
    console.log(width);
    this.path = this.paper.path("M 10 20" + "L " + (width - 10) + " 20");
    return this;
  },
  getTotalCalculatedTime: function () {
    return this.totalTime = this.collection.reduce(function(memo,stop) {
      return memo + stop.time;
    }, 0);
  }
});