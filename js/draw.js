// data processing
var density_data = [
  {
    density: "all",
    isclosed: false,
    value: 28.99
  },
  {
    density: "all",
    isclosed: true,
    value: 34.30
  },
  {
    density: "similar",
    isclosed: false,
    value: 6.85
  },
  {
    density: "similar",
    isclosed: true,
    value: 6.57
  },

]

var allDensity = [];
var similarDensity = [];

for(var i = 0; i < density_data.length; i++){
	if(density_data[i]["density"] === "all"){
		allDensity.push(density_data[i]);
	}else{
		similarDensity.push(density_data[i]);
	}
}

$(document).ready(function () {
  loadMapVis();
  createBarChart(allDensity);
});

var width = 800,
    height = 400,
    barWidth = 50;

// setting scale for density bar chart
var y_density = d3.scale.linear()
  .domain([0, 40])
  .range([400, 0]);

function loadMapVis() {
  d3.csv("data/data_clean.csv", function(data){

    var svg = d3.select("#map-vis")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var projection = d3.geo.mercator()
      .center([-112.074036, 33.448376])
      .scale(100000)
      .translate([width/2, height/2]);

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
          return "#D22322";
        } else {
          return "#C6C6C6";
        }
      })
  });
}

// making the first bar chart
function createBarChart(data) {

  var svg = d3.select("#density-vis")
    .append("svg")
    .attr("id", "density_svg")
    .attr("width", width)
    .attr("height", height);

  var bar = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(" + i * barWidth + ",0)";
      });

  bar.append("rect")
      .attr("y", function(d) { return y_density(d.value); })
      .attr("height", function(d) { return height - y_density(d.value); })
      .attr("width", barWidth - 1)
      .attr("fill", function(d){
        if(d.isclosed){
          return "#D22322";
        }else{
          return "#C6C6C6";
        }
      });

  bar.append("text")
      .attr("x", 10)
      .attr("y", function(d) { return y_density(d.value) - 15; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });
}

function updateBarChart(data) {
  var bar = d3.select("#density_svg").selectAll("g").select("rect");
  var text = d3.select("#density_svg").selectAll("g").select("text");

  bar.data(data)

  text.data(data)

  bar.transition()
      .duration(500)
      .attr("y", function(d) {
        return y_density(d.value); })
      .attr("height", function(d) {
        return height - y_density(d.value); })
      .attr("fill", function(d){
        if(d.isclosed){
          return "#D22322";
        }else{
          return "#C6C6C6";
        }
      });

  text.transition()
      .duration(500)
      .attr("y", function(d) { return y_density(d.value) - 15; })
      .text(function(d) { return d.value; });
}

function updateData(element) {
  if(element.value == "Density") {
    updateBarChart(allDensity);
  }
  else {
    updateBarChart(similarDensity);
  }
}
