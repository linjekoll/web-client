# Web client for Linjekoll

## Installation

Start by cloning the project using git.

`git clone git@github.com:linjekoll/web-client.git`

Navigate to the downloaded folder and run bundler.

`cd web-client && bundle install`

## Development

Run `foreman start` in the application folder, `foreman` will do the following.

1. Watch and compile files<sup>1</sup> on-the-fly.

## Models

Models extend Backbone.Model if no other information is given

### Stops
- Extends: Collection
- Just a collection of stops

### Line
- Arguments: line id, colours (foreground, background)
- Contains a collection of stops
- Fetches stops from the server using paths like `/lines/:line_id/stops`

### Vehicle
- Arguments: journey id, vehicle type
- Takes trip information in the following format: `{destX: 123, destY: 123, time: 123}`
- Trips have a custom setter-method which sets the `this.time` and `this.destination` attributes, otherwise it wouldn't be possible to have separate `change` events for `time` and `destination`
- Receives updates from the websocket server and triggers events for the view.

## Views

### Line
- Contains a canvas for Raphael and info like end stations and line name
- Iterates through the Line collection to find typical travel times and calculates relative pixel distances
- NEEDS:
  - In the line model:
    - id, name, totalTime, stops
  - In the stop model:
    - time
- Currently renders it self when, and only when, the stops collection in the line model fires the `reset` event.

### Stop
- Draws itself as a dot and a text.
- Params: needs a shape and a reference to its paper/canvas

### Vehicle
- Reacts to events in the Vehicle model:
  - change:time: if vehicle is moving, change animation to reflect new time. Otherwise, do nothing?
  - trainLeftStation: starts the vehicle moving towards the current destination.

## Rake tasks

`compile` Compresses assets files<sup>1</sup>. 
If you want to use the [YUI](http://developer.yahoo.com/yui/compressor/) compressor, pass `ENV=production` on startup.

------------

<sup>1</sup> `sass`, `scss`, `css` and `js` files.
