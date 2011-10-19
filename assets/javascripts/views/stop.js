App.views.Stop = Backbone.View.extend({
    initialize: function(options) {
        this.paper = options.paper;
        this.shape = options.shape;
        this.x = options.x;
        this.y = options.y;
        
        _.bindAll(this);
        this.render();
    },
    
    render: function() {
        
        // If there is no shape, we create it, otherwise we move it to the correct position
        if (!this.shape) {
            this.shape = this.paper.circle(this.x, this.y, 5).attr({fill: "black"});
        } else {
            this.shape.attr({
                x: this.x,
                y: this.y,
                fill: "black"
            });
        }
        
        // If there is text, remove it to prepare for rerendering
        if (this.text) {
            this.text.remove();
        }
        
        var textYCoord = this.y;
        var textXCoord = this.x + 10;
        var x = this.x;
        var name = this.model.get("name");
        this.text = 
          this.paper
          .text(textXCoord, textYCoord, name)
          .attr({
            "font-family": "Myriad Pro"
          , "text-anchor": "start"
          , "font-size": 16
          })
          .rotate( - 60, x, textYCoord);
    },
    remove: function() {
        this.shape.hide();
        this.text.hide();
    }
});