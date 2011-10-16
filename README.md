# Web client for Linjekoll

## Installation

Start by cloning the project using git.

`git clone git@github.com:linjekoll/web-client.git`

Navigate to the downloaded folder and run bundler.

`cd web-client && bundle install`

## Development

Run `foreman start` in the application folder, `foreman` will do the following.

1. Watch and compile files<sup>1</sup> on-the-fly.

## Rake tasks

`compile` Compresses assets files<sup>1</sup>. 
If you want to use the [YUI](http://developer.yahoo.com/yui/compressor/) compressor, pass `ENV=production` on startup.

------------

<sup>1</sup> `sass`, `scss`, `css` and `js` files.