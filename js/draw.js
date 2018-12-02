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
		group1 = ['ysPpFXooSEtwHkIdcOd4Kg', 'Zy2vca7i9QFGRKa4m0C__A', 'yVQiGdxmnrkJDyQXv2maNA', 'XkNQVTkCEzBrq7OlRHI11Q', 'XbVqzUHS3c9FhG4lI13c3Q']

		//Filtered data on target restaurants, inspired by
		//https://stackoverflow.com/questions/10615290/select-data-from-a-csv-before-loading-it-with-javascript-d3-library
		viz4data1 = d.filter(function(row) {
        	if(group1.indexOf(row['business_id']) > -1) {
        		return row;
        	};

    	})

    	console.log(viz4data1);


    	barPrimary(viz4data1);

	})
}

//Primary bar chart

function barPrimary(viz4data1) {

	//Margin, scales, and canvas
	var margin = { top: 20, right: 20, bottom: 20, left: 20 },
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
  	// var yScale = d3.scaleLinear()
   //  	.domain([d3.min(viz4data1, function(d) { return +d.zreview_count_all; }), d3.max(viz4data1, function(d) { return +d.zreview_count_all; })])
   //  	.range([(height/2), 0]);

   	var svg = d3.select('#viz4-1').append('svg')
   		.attr('width', width + margin.left + margin.right)
   		.attr('height', height + margin.top + margin.bottom)
   		.append('g')
   			.attr("transform",
        	"translate(" + margin.left + "," + margin.top + ")");

    barY = function(d) {
    	if (+d.zreview_count_all < 0) {
    		return height/2
    	} else {
    		return (height/2) - yScale(+d.zreview_count_all);
    	}
    }

    barHeight = function(d) {
    	if (+d.zreview_count_all < 0) {
    		return yScale((-1 * +d.zreview_count_all));
    	} else {
    		return yScale(+d.zreview_count_all);
    	}
    }

    //Chart
    svg.selectAll('.bar-primary')
    	.data(viz4data1)
    	.enter()
    	.append('rect')
    	.attr("class", function(d) { return "bar bar--" + (+d.zreview_count_all	 < 0 ? "negative" : "positive"); })
    	.attr('fill', 'navy-blue')
    	.attr('x', function(d) { return xScale(d.business_id); })
    	.attr('width', xScale.bandwidth())
    	.attr("y", function(d) { return height - yScale(Math.min(0, +d.zreview_count_all)); })
    	.attr("height", function(d) { return Math.abs(yScale(+d.zreview_count_all) - yScale(0)); })

   	//Labels
   	svg.selectAll('text.bar-label')
   		.data(viz4data1)
   		.enter()
   		.append('text')
   		.text(function(d){ return d.business_id; })
   		.attr('y', (height/2))
    	.attr('x', function(d) { return xScale(d.business_id); })
    	.attr('fill', 'red')
    	.style('font-size', '10px');




}

