require "rubygems"
require "bundler"
require "pathname"
require "logger"
require "yui/compressor"
require "fileutils"
require "compass"
require "sass"
require "sass/plugin"
require "sprockets"
require "sprockets-sass"


Bundler.require

root           = Pathname(File.dirname(__FILE__))
logger         = Logger.new(STDOUT)
bundles        = %w(application.css application.js)
build_dir      = root.join("public")
source_dir     = root.join("assets")
js_compressor  = YUI::JavaScriptCompressor.new
css_compressor = YUI::CssCompressor.new

task :compile do
  sprockets = Sprockets::Environment.new(root) do |env|
    env.logger = logger
  end
  
  if ENV["ENV"] == "production"
    sprockets.js_compressor = js_compressor
    sprockets.css_compressor = css_compressor
  end
  
  sprockets.append_path(source_dir.join("javascripts").to_s)
  sprockets.append_path(source_dir.join("stylesheets").to_s)

  bundles.each do |bundle|
    assets = sprockets.find_asset(bundle)
    prefix, basename = assets.pathname.to_s.split("/")[-2..-1]
    FileUtils.mkpath build_dir.join(prefix)    
    assets.write_to(build_dir.join(prefix, basename))
  end
end