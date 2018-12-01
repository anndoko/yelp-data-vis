$(document).ready(function () {
  loadMapVis();
});

var w = 800;
var h = 600;

function loadMapVis() {
  d3.csv("data/data_clean.csv", function(data){

    var svg = d3.select("#map-vis")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var projection = d3.geo.mercator()
      .center([-112.074036, 33.448376])
      .scale(50000)
      .translate([w/2, h/2]);

    var circles = svg.selectAll("circle")
      .data(data.filter(function(d){
        return d["city"] == "Phoenix";
      }))
      .enter()
      .append("circle")
      .attr("cx",function(d) {
        return projection([d["coordinates.longitude"], d["coordinates.latitude"]])[0];
      })
      .attr("cy",function(d) {
        return projection([d["coordinates.longitude"], d["coordinates.latitude"]])[1];
      })
      .attr("r","2px")
      .style("fill",function(d){
        if (d["is_claimed"]==="True"){
          return "black";
        } else {
          return "red";
        }
      })
  });
}
