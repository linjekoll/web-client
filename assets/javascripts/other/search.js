$(function() {
  var searchBox = $("#search-result");
  // [{
  //   "name": "5",
  //   "id": 4,
  //   "foreground-color": "green",
  //   "background-color": "white",
  //   "provider": 1,
  //   "stops": [],
  //   "vehicleType": 1,
  //   "end_stations": [1, 4]
  // }]
  
  var template = _.template('<li data-line-ids="<%= line_ids %>" class="stop"><%= stopName %><li>');
  var ul = $("#search-result ul");
  $("#search-result").hide();
  $("input#search_key").keydown(function() {
    var value = $(this).val();
    if(value.length > 1){
      $.get("/lineart-enterprise-app-web/rest/stops/query/" + value, function(data) {
        console.debug(data);
        var lines = eval(data);
        console.debug(lines);
        console.debug(lines.length);
        if(lines.length > 0){
          ul.empty();
          _.each(lines, function(line) {
            ul.append(template(line));
          });
          $("#search-result").show();
        } else {
          $("#search-result").hide();
        }
      });
    }
  });
});