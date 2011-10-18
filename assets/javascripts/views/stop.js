App.views.Stop = Backbone.View.extend({
    initialize: function(options) {
        this.paper = options.paper;
        this.shape = options.shape;

        _.bindAll(this);
    },
    
    render: function() {
        var x = this.model.get("x");
        var y = this.model.get("y");
        
        // If there is no shape, we create it, otherwise we move it to the correct position
        if (!this.shape) {
            this.shape = this.paper.circle(x, y, 5);
        } else {
            this.shape.attr({
                x: x,
                y: y
            });
        }
        
        // If there is text, remove it to prepare for rerendering
        if (this.text) {
            this.text.remove();
        }
        
        var textYCoord = y;
        var textXCoord = x + 10;
        this.text = 
          this.paper
          .text(textXCoord, textYCoord, this.model.get("name"))
          .attr({
            "font-family": "Myriad Pro"
          , "text-anchor": "start"
          , "font-size": 20
          })
          .rotate( - 60, x, textYCoord);
    },
    remove: function() {
        this.shape.hide();
        this.text.hide();
    }
});