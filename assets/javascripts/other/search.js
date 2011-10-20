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
  
  var template = _.template('<li data-line-ids="<%= line_ids %>" class="stop"><%= name %><li>');
  var ul = $("#search-result ul");
  $("#search-result").hide();
  $("input#search_key").keydown(function() {
    var value = $(this).val();
    if(value.length > 1){
      $.get("/rest/stops/query/" + value, function(data) {
        var lines = JSON.parse(data);
        if(lines.length > 1){
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