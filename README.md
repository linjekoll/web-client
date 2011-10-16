# Web client for Linjekoll

## Installation

Start by cloning the project using git.

`git clone git@github.com:linjekoll/web-client.git`

Navigate to the downloaded folder and run bundler.

`cd web-client && bundle install`

## Development

Run `foreman start` in the application folder, `foreman` will do the following.

1. Watch and compile `sass` and `scss` on-the-fly.

## Models

Models extend Backbone.Model if no other information is given

### Line
- Extends: Collection
- Arguments: line id, colours (foreground, background)
- Fetches stops from the server using paths like `/lines/:line_id/stops`

### Vehicle
- Arguments: journey id, vehicle type
- Receives updates from the websocket server and triggers events for the view.

## Views

### Line
- Probably contains a canvas for Raphael and info like end stations and line name
- Iterates through the Line collection to find typical travel times and calculates relative pixel distances

### Vehicle
- Reacts to events in the Vehicle model:
  - change:time: if vehicle is moving, change animation to reflect new time. Otherwise, do nothing?
  - trainLeftStation: starts the vehicle moving towards the current destination.