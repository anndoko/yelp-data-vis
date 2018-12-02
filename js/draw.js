//Content to load on document ready
$(document).ready(function() {

   	//Load the charts
	loadData();
});


//Load data sources, call viz functions
function loadData() {
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
}

//Primary bar chart

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
