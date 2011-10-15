App.views.Line = Backbone.View.extend({
  tag: "div",
  className: "line",
  initialize: function() {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
    this.template = _.template($("#line_template").html());
    
  },
  render: function() {
    var rendered = this.template(this.model.toJSON());
    $(this.el).html(rendered);
    return this;
  }
});