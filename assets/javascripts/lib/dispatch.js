/*
  Wrapper for the WebSocket "class".
  It makes it possible to bind events to the connection.
  
  @url String The websocket server, including the port
  
  Example:
    var socket = new DispatchSocket();
    socket.bind("my_custom_event", function(data){
      alert("Hell yeah, new data + " + data);
    });
    
    socket.send("my_custom_event", {
      name: "Linjekoll", 
      message : "My awesome message!"
    });
*/
var DispatchSocket = function(url) {
  // var conn = new WebSocket(url);

  var callbacks = {};

  /* 
    We should be able to bind events to the websocket connection 
    @eventName String Event to bind to
    @callback Function Callback to be called when @eventName is triggered.
  */
  this.bind = function(eventName, callback) {
    callbacks[eventName] = callbacks[eventName] || [];
    callbacks[eventName].push(callback);
    return this;
  };

  /* 
    Makes it possible to push data to an event 
    @eventName String What event should we trigger?
    @eventData String What data should we push to server?
  */
  this.send = function(eventName, eventData) {
    console.log("Eventdata: ", eventData);
    var payload = JSON.stringify({
      event: eventName,
      data: eventData
    });
    
   // conn.send(payload);
    return this;
  };
  
  // /* Private methods */
  // conn.onmessage = function(evt) {
  //   var json = JSON.parse(evt.data)
  //   dispatch(json.event, json.data);
  // };
  // 
  // conn.onclose = function() {
  //   dispatch("close", null);
  // };
  // 
  // conn.onopen = function() {
  //   dispatch("open", null);
  // };

  var dispatch = function(event_name, message) {
    var chain = callbacks[event_name];

    /* No callbacks for this event */
    if (typeof chain == "undefined") return;
    for (var i = 0; i < chain.length; i++) {
      chain[i](message);
    }
  };
};