/* 
  Ower own Websocket class.
  Take a look the lib/dispatch.js file for more info
*/
App.globals.socket = new DispatchSocket("ws://46.16.232.244:3333");

App.globals.slideDown = function() {
  var el = $(".line:first");
  if (el && el.offset()) {
    var offset = el.offset().top;
    $('html,body').animate({
      scrollTop: offset
    },
    500);
  }
};

/* Creating a container for all lines */
window.lines = new App.models.Lines();

//= require "lib/funfunfun"

$(function() {
  $.get("/static/line.template.html", function(data) {
    $("#line-template").html(data);
  });

  var template = _.template('<li data-provider-id="1" data-line-id="<%= id %>"><%= name %></li>');
  var items = $("#lines");

  $("#search-result li").live("click", function() {
    var list_ids = eval("[" + $(this).data("line-ids") + "]");
    items.empty();
    _.each(list_ids, function(line_id) {
      var line = new App.models.Line({
        id: line_id
      }).fetch({
        success: function(model) {
          var data = template({
            id: model.get("id"),
            name: model.get("name")
          });

          items.append(data);
        }
      })
    });
  });

  $("#lines li").live("click", function() {
    var $self, providerId, lineId;

    $self = $(this);
    providerId = $self.data("provider-id");
    lineId = $self.data("line-id");

    var line = lines.get(lineId);

    line.populateStops();

    var lineView = new App.views.Line({
      model: line
    });

    line.set({
      view: lineView
    })

    var lineCookies = $.cookie("lines");

    if (lineCookies) {
      var found = false;
      var line_ids = lineCookies.split(",");
      for (var i = 0; i < line_ids.length; i++) {
        if (line_ids[i] == line.get("id")) {
          found = true;
        }
      };

      if (!found) {
        lineCookies = line_ids.push(line.get("id")).join(",")
      }
    } else {
      lineCookies = line.get("id");
    }

    $.cookie("lines", lineCookies);

    App.globals.logger("Subscribing to line id " + lineId + " with provider id " + providerId);
    
    setTimeout(function() {
      App.globals.slideDown();
    }, 1000);
  });

  lines.fetch({
    success: function() {
      var lineCookies = $.cookie("lines");
      if (lineCookies) {
        var line_ids = lineCookies.split(",")

        for (var i = 0; i < line_ids.length; i++) {
          var line = lines.get(line_ids[i]);
          line.populateStops();

          var lineView = new App.views.Line({
            model: line
          });

          line.set({
            view: lineView
          });
        };
      }

      setTimeout(function() {
        App.globals.slideDown();
      },
      1000);
    },
  });

  /*
    Close button for line view
  */
  $("img.close-button").live("click", function() {
    var main = $(this).parent().parent()
    var id = main.attr("id");
    var okay = [];
    var lineCookies = $.cookie("lines");
    var line_ids = lineCookies.split(",");
    for (var i = 0; i < line_ids.length; i++) {
      if (line_ids[i] != id) {
        okay.push(line_ids[i]);
      }
    }

    $.cookie("lines", okay.join(","));

    main.hide();
  });
});

App.globals.gateKeeper = new App.models.GateKepper();