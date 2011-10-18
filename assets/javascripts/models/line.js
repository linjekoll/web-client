App.models.Line = Backbone.Model.extend({
    initialize: function() {
        var stops = new App.models.Stops({
            model: App.models.Stop,
            id: this.get("id")
        });
        // store the stops, and then bind to the event
        this.set({stops: stops});
        stops.bind("reset", this.stopsLoaded, this);
        stops.fetch();
    },

    stopsLoaded: function(){
        // Calculate total time, now that the collection has been populated
        this.calculateTotalTime();
    },

    calculateTotalTime: function() {
        var totalTime = this.get("stops").reduce(function(memo, stop) {
            return stop.get("time") + memo;
        }, 0);
        this.set({totalTime: totalTime});
    }
});