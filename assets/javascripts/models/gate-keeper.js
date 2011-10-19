/*
What should this model do? 
- Receive data from the websocket connect
- If the event is an trip_update;
  - Select the given station from the stations collection
  - Pass data to the found station
  - If no station is found, throw the data away
- Otherwise; do nothing
- Log everything
*/

App.models.GateKepper = Backbone.Model.extend({
  
});