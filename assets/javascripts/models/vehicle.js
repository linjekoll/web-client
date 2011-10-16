App.models.Vehicle = Backbone.Model.extend({
  setTrip: function(trip) {
    this.set({time: trip.time, destination: trip.destination}, {silent: true});
    this.trigger('change:trip');
    return this;
  },
});