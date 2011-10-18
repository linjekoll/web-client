App.views.Line = Backbone.View.extend({
  tag: "div",
  className: "line",
  initialize: function() {
    // Set id of element to reflect id of line
    $(this.el).attr({id: this.model.id});
    
    this.stopViews = [];
    
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.template = _.template($("#line-template").html());
    this.render();
  },
  render: function() {
    // Render HTML
    var rendered = this.template(this.model.toJSON());
    $(this.el).html(rendered);
    $("#outer").append(this.el);
    
    // Prepare Raphael
    this.paper = this.paper || Raphael(this.$(".canvas").get(0));
    var width = $(this.el).width();
    this.path = this.paper.path("M 10 20" + "L " + (width - 10) + " 20");
    
    // Draw stops
    var totalTime = this.model.get("totalTime");
    this.model.get("stops").forEach(function(stop) {
      
    });
    return this;
  }
});