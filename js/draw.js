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
  createRateChart();
  //createReviewChart();
  createBarChart(allDensity);
});

var width = 800,
    height = 400,
    barWidth = 100,
    padding = 50;

// setting scale for density bar chart
var y_density = d3.scaleLinear()
  .domain([0, 40])
  .range([(height - padding), 0]);

function loadMapVis() {
  d3.csv("data/data_clean.csv", function(data){

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>" + d["review_count"] + " Reviews on Yelp</strong>" ;
      })

    var svg = d3.select("#map-vis")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    var projection = d3.geoMercator()
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
      .attr("r","4px")
      .style("fill",function(d){
        if (d["is_claimed"]==="True"){
          return "#D22322";
        } else {
          return "#C6C6C6";
        }
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

      svg.call(tip);
  });
}

// making the first bar chart
function createBarChart(data) {

  var title = (data[0].density == "all")? "Average Restaurant Density" : "Average Similar Restaurant Density"

  // var xAxis = d3.svg.axis()
  //   .scale(x)
  //   .orient("bottom");

  var svg = d3.select("#density-vis")
    .append("svg")
    .attr("id", "density_svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("text")
      .attr("x", -350)
      .attr("y", 225)
      .attr("dy", ".75em")
      .attr("id", "y-title")
      .text(title)
      .attr("transform", "rotate(-90)");

  var bar = svg.selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(" + (i * barWidth + 270) + ",0)";
      });

  bar.append("rect")
      .attr("y", function(d) { return y_density(d.value); })
      .attr("height", function(d) { return height - padding - y_density(d.value); })
      .attr("width", barWidth - 10)
      .attr("fill", function(d){
        if(d.isclosed){
          return "#C6C6C6";
        }else{
          return "#D22322";
        }
      });

  bar.append("text")
      .attr("x", 2)
      .attr("y", function(d) { return y_density(d.value) - 15; })
      .attr("dy", ".75em")
      .text(function(d) { return d.value; });

  bar.append("text")
      .attr("x", 2)
      .attr("y", 360)
      .attr("dy", ".75em")
      .text(function(d) { return (d.isclosed? "CLOSED" : "OPEN"); });

}

function updateBarChart(data) {

  var title = (data[0].density == "all")? "Average Restaurant Density" : "Average Similar Restaurant Density";
  var bar = d3.select("#density_svg").selectAll("g").select("rect");
  var text = d3.select("#density_svg").selectAll("g").select("text");

  bar.data(data)

  text.data(data)

  d3.select("#y-title").text(title)

  bar.transition()
      .duration(500)
      .attr("y", function(d) {
        return y_density(d.value); })
      .attr("height", function(d) {
        return height - padding - y_density(d.value); })
      .attr("fill", function(d){
        if(d.isclosed){
          return "#C6C6C6";
        }else{
          return "#D22322";
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


function createRateChart(){
  //SVG setup
  const margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 550 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

  //x scales
  const x = d3.scaleLinear()
      .rangeRound([0, width])
      .domain([0, 5]);

  //set up svg
  const svg = d3.select("#star-ratings")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
              `translate(${margin.left}, ${margin.top})`);

  //tooltip
  const tooltip = d3.select("body")
    .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  const t = d3.transition()
        .duration(1000);

  const dataFile = "data/data-star.csv"

  //number of bins for histogram
  const nbins = 10;

  //Note: data fetching is done each time the function is ran
  //as d3.csv is replaced by tabletop.js request to get data each time
  //from google spreadsheet
  function update(){
    // Get the data
    d3.csv(dataFile, function(error, allData) {
      allData.forEach(function(d) {
          d.Name = d.Name
          d.Value = +d.Value;
      });
      //simulate new data by randomizing/slicing
      let data = allData
        .slice(0, 35)

      //histogram binning
      const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(nbins))
        .value(function(d) { return d.Value;} )

      //binning data and filtering out empty bins
      const bins = histogram(data).filter(d => d.length>0)

      //g container for each bin
      let binContainer = svg.selectAll(".gBin")
        .data(bins);

      binContainer.exit().remove()

      let binContainerEnter = binContainer.enter()
        .append("g")
          .attr("class", "gBin")
          .attr("transform", d => `translate(${x(d.x0)}, ${height})`)

      //need to populate the bin containers with data the first time
      binContainerEnter.selectAll("circle")
          .data(d => d.map((p, i) => {
            return {idx: i,
                    name: p.Name,
                    value: p.Value,
                    radius: (x(d.x1)-x(d.x0))/4
                  }
          }))
        .enter()
        .append("circle")
          .attr("class", "grey")
          .attr("cx", 0) //g element already at correct x pos
          .attr("cy", function(d) {
              return - d.idx * 2 * d.radius - d.radius; })
          .attr("r", 0)
          .on("mouseover", tooltipOn)
          .on("mouseout", tooltipOff)
          .transition()
            .duration(500)
            .attr("r", function(d) {
            return (d.length==0) ? 0 : d.radius; })

      binContainerEnter.merge(binContainer)
          .attr("transform", d => `translate(${x(d.x0)}, ${height})`)

      //enter/update/exit for circles, inside each container
      let dots = binContainer.selectAll("circle")
          .data(d => d.map((p, i) => {
            return {idx: i,
                    name: p.Name,
                    value: p.Value,
                    radius: (x(d.x1)-x(d.x0))/4
                  }
          }))

      //EXIT old elements not present in data
      dots.exit()
          .attr("class", "grey")
        .transition(t)
          .attr("r", 0)
          .remove();

      //UPDATE old elements present in new data.
      dots.attr("class", "grey");

      //ENTER new elements present in new data.
      dots.enter()
        .append("circle")
          .attr("class", "grey")
          .attr("cx", 0) //g element already at correct x pos
          .attr("cy", function(d) {
            return - d.idx * 2 * d.radius - d.radius; })
          .attr("r", 0)
        .merge(dots)
          .on("mouseover", tooltipOn)
          .on("mouseout", tooltipOff)
          .transition()
            .duration(500)
            .attr("r", function(d) {
            return (d.length==0) ? 0 : d.radius; })
    });//d3.csv
  };//update

  function tooltipOn(d) {
    //x position of parent g element
    let gParent = d3.select(this.parentElement)
    let translateValue = gParent.attr("transform")

    let gX = translateValue.split(",")[0].split("(")[1]
    let gY = height + (+d3.select(this).attr("cy")-50)

    d3.select(this)
      .classed("selected", true)
    tooltip.transition()
         .duration(200)
         .style("opacity", .9);
    tooltip.html(d.name + "<br/> (" + d.value + ")")
      .style("left", gX + "px")
      .style("top", gY + "px");
  }//tooltipOn

  function tooltipOff(d) {
    d3.select(this)
        .classed("selected", false);
      tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  }//tooltipOff



  // add x axis
  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //draw everything
  update();

  //update with new data every 3sec
  d3.interval(function() {
    update();
  }, 3000);
}

function createReviewChart(){
  d3.csv('data/data_clean.csv', function(d) {

    viz2data = d;

    //First 5 restaurants for viz4
    group1 = ['Zy2vca7i9QFGRKa4m0C__A', 'yVQiGdxmnrkJDyQXv2maNA', 'ysPpFXooSEtwHkIdcOd4Kg','XkNQVTkCEzBrq7OlRHI11Q', 'XbVqzUHS3c9FhG4lI13c3Q']

    //Filtered data on target restaurants, inspired by
    //https://stackoverflow.com/questions/10615290/select-data-from-a-csv-before-loading-it-with-javascript-d3-library
    viz4data1 = d.filter(function(row) {
          if(group1.indexOf(row['business_id']) > -1) {
            return row;
          };

      })

      console.log(viz4data1);


      barPrimary(viz4data1);
      bar2(viz4data1);
      bar3(viz4data1);
      bar4(viz4data1);
      bar5(viz4data1);

  })


  function barPrimary(viz4data1) {

  	//Margin, scales, and canvas
  	var margin = { top: 0, right: 20, bottom: 100, left: 60 },
          width = $('#viz4-1').width(),
          height = $('#viz4-1').height(),
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
      	.domain(viz4data1.map(function(d) { return d.business_id; }))
      	.range([0, width])
      	.padding(0.1);

      var yScale = d3.scaleLinear()
      	.range([height, 0])
      	.domain(d3.extent(viz4data1, function(d) { return +d.zreview_count_all; })).nice()


     	var svg = d3.select('#viz4-1').append('svg')
     		.attr('width', width + margin.left + margin.right)
     		.attr('height', height + margin.top + margin.bottom)
     		.append('g')
     			.attr("transform",
          	"translate(" + margin.left + "," + margin.top + ")");

      //Chart
      svg.selectAll('.bar')
      	.data(viz4data1)
      	.enter()
      	.append('rect')
      	.attr("class", function(d) { return "bar bar--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
      	.attr('fill', 'navy-blue')
      	.attr('x', function(d) { return xScale(d.business_id); })
      	.attr('width', xScale.bandwidth())
      	.attr("height", function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); })
      	.attr("y", function(d) { return (height/2 - yScale(Math.min(0, +d.zreview_count_all)) + yScale(+d.zreview_count_all)) })

    	//Axes
    	//var xAxis = d3.axisBottom().scale(xScale)
    	var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format('.0%'));

    	//X axis group
  	// svg.append("g")
  	// 	.attr("class","axis x-axis")
  	// 	.attr("transform","translate(0," + height + ")")
  	// 	.call(xAxis);

  	translateX = function(d) {

  	}

  	// d3.selectAll('.x-axis text')
  	// 	.attr("transform","rotate(-45)")
  	// 	.attr()
  	// 	.attr("text-anchor","end");

  	//Y axis group
  	svg.append("g")
  		.attr("class","axis y-axis")
  		.call(yAxis.ticks(3));


  	barX = function(d) { return xScale(d.business_id); };
  	barWidth = xScale.bandwidth();


  	formatV = d3.format('.0%');



     	//Biz id Labels
     	svg.selectAll('text.label')
     		.data(viz4data1)
     		.enter()
     		.append('g')
     		.attr('x', function(d) { barX(d) })
     		.attr('transform', 'translate(' + barWidth/2 + ',0)')
      	.attr('width', barWidth)
  	   		.append('text')
  	   		.attr("class", function(d) { return "label label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   		.text(function(d){ return d.business_id; })
  	   		.attr('y', (height/2))
  	    	.attr('x', function(d) { return xScale(d.business_id); })
  	    	.style('font-size', '12px')
  	    	.attr('text-anchor', 'middle');


  	 //Reposition labels depending on positive or negative values
  	 d3.selectAll('.label--positive')
  	 		.attr('transform', 'translate(0,16)');

  	 d3.selectAll('.label--negative')
  	 		.attr('transform', 'translate(0,-16)');

  	 //Zero line
  	 svg.append('line')
  	 	.attr('y1', height/2)
  	 	.attr('y2', height/2)
  	 	.attr('x1', 0)
  	 	.attr('x2', width)
  	 	.attr('stroke-dasharray','1 1');


  }

  function bar2(viz4data1) {

  	//Margin, scales, and canvas
  	var margin = { top: 0, right: 20, bottom: 100, left: 60 },
          width = $('#viz4-2').width(),
          height = $('#viz4-2').height(),
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
      	.domain(viz4data1.map(function(d) { return d.business_id; }))
      	.range([0, width])
      	.padding(0.1);

      var yScale = d3.scaleLinear()
      	.range([height, 0])
      	.domain(d3.extent(viz4data1, function(d) { return +d.zreview_count_all; })).nice()


     	var svg = d3.select('#viz4-2').append('svg')
     		.attr('width', width + margin.left + margin.right)
     		.attr('height', height + margin.top + margin.bottom)
     		.append('g')
     			.attr("transform",
          	"translate(" + margin.left + "," + margin.top + ")");

      //Chart
      svg.selectAll('.bar')
      	.data(viz4data1)
      	.enter()
      	.append('rect')
      	.attr("class", function(d) { return "bar bar--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
      	.attr('fill', 'navy-blue')
      	.attr('x', function(d) { return xScale(d.business_id); })
      	.attr('width', xScale.bandwidth())
      	.attr("height", function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); })
      	.attr("y", function(d) { return (height/2 - yScale(Math.min(0, +d.zreview_count_all)) + yScale(+d.zreview_count_all)) })

    	//Axes
    	//var xAxis = d3.axisBottom().scale(xScale)
    	var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format('.0%'));

    	//X axis group
  	// svg.append("g")
  	// 	.attr("class","axis x-axis")
  	// 	.attr("transform","translate(0," + height + ")")
  	// 	.call(xAxis);

  	translateX = function(d) {

  	}

  	// d3.selectAll('.x-axis text')
  	// 	.attr("transform","rotate(-45)")
  	// 	.attr()
  	// 	.attr("text-anchor","end");

  	//Y axis group
  	svg.append("g")
  		.attr("class","axis y-axis")
  		.call(yAxis.ticks(3));


  	barX = function(d) { return xScale(d.business_id); };
  	barWidth = xScale.bandwidth();


  	formatV = d3.format('.0%');

     	//Value labels
     	// svg.selectAll('text.v-label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',' + function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); } + ')')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "v-label v-label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return formatV(+d.zreview_count_all); })
  	   // 		.attr("y", function(d) { return yScale(+d.zreview_count_all) })
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '20px')
  	   //  	.attr('text-anchor', 'middle')


     	//Biz id Labels
     	// svg.selectAll('text.label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',0)')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "label label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return d.business_id; })
  	   // 		.attr('y', (height/2))
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '12px')
  	   //  	.attr('text-anchor', 'middle');


  	 //Reposition labels depending on positive or negative values
  	 d3.selectAll('.label--positive')
  	 		.attr('transform', 'translate(0,16)');

  	 d3.selectAll('.label--negative')
  	 		.attr('transform', 'translate(0,-16)');

  	 //Zero line
  	 svg.append('line')
  	 	.attr('y1', height/2)
  	 	.attr('y2', height/2)
  	 	.attr('x1', 0)
  	 	.attr('x2', width)
  	 	.attr('stroke-dasharray','1 1');


  }

  function bar3(viz4data1) {

  	//Margin, scales, and canvas
  	var margin = { top: 0, right: 20, bottom: 100, left: 60 },
          width = $('#viz4-3').width(),
          height = $('#viz4-3').height(),
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
      	.domain(viz4data1.map(function(d) { return d.business_id; }))
      	.range([0, width])
      	.padding(0.1);

      var yScale = d3.scaleLinear()
      	.range([height, 0])
      	.domain(d3.extent(viz4data1, function(d) { return +d.zreview_count_all; })).nice()


     	var svg = d3.select('#viz4-3').append('svg')
     		.attr('width', width + margin.left + margin.right)
     		.attr('height', height + margin.top + margin.bottom)
     		.append('g')
     			.attr("transform",
          	"translate(" + margin.left + "," + margin.top + ")");

      //Chart
      svg.selectAll('.bar')
      	.data(viz4data1)
      	.enter()
      	.append('rect')
      	.attr("class", function(d) { return "bar bar--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
      	.attr('fill', 'navy-blue')
      	.attr('x', function(d) { return xScale(d.business_id); })
      	.attr('width', xScale.bandwidth())
      	.attr("height", function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); })
      	.attr("y", function(d) { return (height/2 - yScale(Math.min(0, +d.zreview_count_all)) + yScale(+d.zreview_count_all)) })

    	//Axes
    	//var xAxis = d3.axisBottom().scale(xScale)
    	var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format('.0%'));

    	//X axis group
  	// svg.append("g")
  	// 	.attr("class","axis x-axis")
  	// 	.attr("transform","translate(0," + height + ")")
  	// 	.call(xAxis);

  	translateX = function(d) {

  	}

  	// d3.selectAll('.x-axis text')
  	// 	.attr("transform","rotate(-45)")
  	// 	.attr()
  	// 	.attr("text-anchor","end");

  	//Y axis group
  	svg.append("g")
  		.attr("class","axis y-axis")
  		.call(yAxis.ticks(3));


  	barX = function(d) { return xScale(d.business_id); };
  	barWidth = xScale.bandwidth();


  	formatV = d3.format('.0%');

     	//Value labels
     	// svg.selectAll('text.v-label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',' + function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); } + ')')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "v-label v-label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return formatV(+d.zreview_count_all); })
  	   // 		.attr("y", function(d) { return yScale(+d.zreview_count_all) })
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '20px')
  	   //  	.attr('text-anchor', 'middle')


     	//Biz id Labels
     	// svg.selectAll('text.label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',0)')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "label label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return d.business_id; })
  	   // 		.attr('y', (height/2))
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '12px')
  	   //  	.attr('text-anchor', 'middle');


  	 //Reposition labels depending on positive or negative values
  	 d3.selectAll('.label--positive')
  	 		.attr('transform', 'translate(0,16)');

  	 d3.selectAll('.label--negative')
  	 		.attr('transform', 'translate(0,-16)');

  	 //Zero line
  	 svg.append('line')
  	 	.attr('y1', height/2)
  	 	.attr('y2', height/2)
  	 	.attr('x1', 0)
  	 	.attr('x2', width)
  	 	.attr('stroke-dasharray','1 1');


  }

  function bar4(viz4data1) {

  	//Margin, scales, and canvas
  	var margin = { top: 0, right: 20, bottom: 100, left: 60 },
          width = $('#viz4-4').width(),
          height = $('#viz4-4').height(),
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
      	.domain(viz4data1.map(function(d) { return d.business_id; }))
      	.range([0, width])
      	.padding(0.1);

      var yScale = d3.scaleLinear()
      	.range([height, 0])
      	.domain(d3.extent(viz4data1, function(d) { return +d.zreview_count_all; })).nice()


     	var svg = d3.select('#viz4-4').append('svg')
     		.attr('width', width + margin.left + margin.right)
     		.attr('height', height + margin.top + margin.bottom)
     		.append('g')
     			.attr("transform",
          	"translate(" + margin.left + "," + margin.top + ")");

      //Chart
      svg.selectAll('.bar')
      	.data(viz4data1)
      	.enter()
      	.append('rect')
      	.attr("class", function(d) { return "bar bar--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
      	.attr('fill', 'navy-blue')
      	.attr('x', function(d) { return xScale(d.business_id); })
      	.attr('width', xScale.bandwidth())
      	.attr("height", function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); })
      	.attr("y", function(d) { return (height/2 - yScale(Math.min(0, +d.zreview_count_all)) + yScale(+d.zreview_count_all)) })

    	//Axes
    	//var xAxis = d3.axisBottom().scale(xScale)
    	var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format('.0%'));

    	//X axis group
  	// svg.append("g")
  	// 	.attr("class","axis x-axis")
  	// 	.attr("transform","translate(0," + height + ")")
  	// 	.call(xAxis);

  	translateX = function(d) {

  	}

  	// d3.selectAll('.x-axis text')
  	// 	.attr("transform","rotate(-45)")
  	// 	.attr()
  	// 	.attr("text-anchor","end");

  	//Y axis group
  	svg.append("g")
  		.attr("class","axis y-axis")
  		.call(yAxis.ticks(3));


  	barX = function(d) { return xScale(d.business_id); };
  	barWidth = xScale.bandwidth();


  	formatV = d3.format('.0%');

     	//Value labels
     	// svg.selectAll('text.v-label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',' + function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); } + ')')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "v-label v-label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return formatV(+d.zreview_count_all); })
  	   // 		.attr("y", function(d) { return yScale(+d.zreview_count_all) })
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '20px')
  	   //  	.attr('text-anchor', 'middle')


     	//Biz id Labels
     	// svg.selectAll('text.label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',0)')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "label label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return d.business_id; })
  	   // 		.attr('y', (height/2))
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '12px')
  	   //  	.attr('text-anchor', 'middle');


  	 //Reposition labels depending on positive or negative values
  	 d3.selectAll('.label--positive')
  	 		.attr('transform', 'translate(0,16)');

  	 d3.selectAll('.label--negative')
  	 		.attr('transform', 'translate(0,-16)');

  	 //Zero line
  	 svg.append('line')
  	 	.attr('y1', height/2)
  	 	.attr('y2', height/2)
  	 	.attr('x1', 0)
  	 	.attr('x2', width)
  	 	.attr('stroke-dasharray','1 1');


  }

  function bar5(viz4data1) {

  	//Margin, scales, and canvas
  	var margin = { top: 0, right: 20, bottom: 100, left: 60 },
          width = $('#viz4-5').width(),
          height = $('#viz4-5').height(),
          width = width - margin.left - margin.right,
          height = height - margin.top - margin.bottom;

      var xScale = d3.scaleBand()
      	.domain(viz4data1.map(function(d) { return d.business_id; }))
      	.range([0, width])
      	.padding(0.1);

      var yScale = d3.scaleLinear()
      	.range([height, 0])
      	.domain(d3.extent(viz4data1, function(d) { return +d.zreview_count_all; })).nice()


     	var svg = d3.select('#viz4-5').append('svg')
     		.attr('width', width + margin.left + margin.right)
     		.attr('height', height + margin.top + margin.bottom)
     		.append('g')
     			.attr("transform",
          	"translate(" + margin.left + "," + margin.top + ")");

      //Chart
      svg.selectAll('.bar')
      	.data(viz4data1)
      	.enter()
      	.append('rect')
      	.attr("class", function(d) { return "bar bar--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
      	.attr('fill', 'navy-blue')
      	.attr('x', function(d) { return xScale(d.business_id); })
      	.attr('width', xScale.bandwidth())
      	.attr("height", function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); })
      	.attr("y", function(d) { return (height/2 - yScale(Math.min(0, +d.zreview_count_all)) + yScale(+d.zreview_count_all)) })

    	//Axes
    	//var xAxis = d3.axisBottom().scale(xScale)
    	var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format('.0%'));

    	//X axis group
  	// svg.append("g")
  	// 	.attr("class","axis x-axis")
  	// 	.attr("transform","translate(0," + height + ")")
  	// 	.call(xAxis);

  	translateX = function(d) {

  	}

  	// d3.selectAll('.x-axis text')
  	// 	.attr("transform","rotate(-45)")
  	// 	.attr()
  	// 	.attr("text-anchor","end");

  	//Y axis group
  	svg.append("g")
  		.attr("class","axis y-axis")
  		.call(yAxis.ticks(3));


  	barX = function(d) { return xScale(d.business_id); };
  	barWidth = xScale.bandwidth();


  	formatV = d3.format('.0%');

     	//Value labels
     	// svg.selectAll('text.v-label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',' + function(d) { return Math.abs(yScale(0) - yScale(+d.zreview_count_all)); } + ')')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "v-label v-label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return formatV(+d.zreview_count_all); })
  	   // 		.attr("y", function(d) { return yScale(+d.zreview_count_all) })
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '20px')
  	   //  	.attr('text-anchor', 'middle')


     	//Biz id Labels
     	// svg.selectAll('text.label')
     	// 	.data(viz4data1)
     	// 	.enter()
     	// 	.append('g')
     	// 	.attr('x', function(d) { barX(d) })
     	// 	.attr('transform', 'translate(' + barWidth/2 + ',0)')
      // 	.attr('width', barWidth)
  	   // 		.append('text')
  	   // 		.attr("class", function(d) { return "label label--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
  	   // 		.text(function(d){ return d.business_id; })
  	   // 		.attr('y', (height/2))
  	   //  	.attr('x', function(d) { return xScale(d.business_id); })
  	   //  	.style('font-size', '12px')
  	   //  	.attr('text-anchor', 'middle');


  	 //Reposition labels depending on positive or negative values
  	 d3.selectAll('.label--positive')
  	 		.attr('transform', 'translate(0,16)');

  	 d3.selectAll('.label--negative')
  	 		.attr('transform', 'translate(0,-16)');

  	 //Zero line
  	 svg.append('line')
  	 	.attr('y1', height/2)
  	 	.attr('y2', height/2)
  	 	.attr('x1', 0)
  	 	.attr('x2', width)
  	 	.attr('stroke-dasharray','1 1');


  }
}

function restSelected(element, selection) {
  if (selection == 'a') {
    $("#result").text("You are correct! Restaurant A is more likely to close. Let's see why.")
  }
  else {
    $("#result").text("Uh oh! Restaurant A is more likely to close. Let's see why.")
  }
}
