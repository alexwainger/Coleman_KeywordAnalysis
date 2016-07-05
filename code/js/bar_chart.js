$(document).ready(function() {
	var margin = {top: 0, right: 10, bottom: 20, left: 200},
		width = 980 - margin.left - margin.right,
		height = 480 - margin.top - margin.bottom,
		num_bars = 20;

	var page_num = 0;

	var svg = d3.select("#bar_chart")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g").attr("transform", "translate(" + margin.left + ","  + margin.top + ")");

	var x = d3.scaleLinear()
		.range([0, width]);

	var y = d3.scaleBand()
		.range([0,height]);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	svg.append("g")
		.attr("class", "x axis")
      	.attr("transform", "translate(0," + height + ")")
      	.style("font", "12px sans-serif");

	svg.append("g")
		.attr("class", "y axis")
		.style("font", "12px sans-serif");

	d3.select("#next").on("click", function() {
		console.log(d3.select("#bar_chart").datum(function() { return this.pagenum}));
	});

	d3.select("#previous").on("click", function() {
		
	});

	d3.csv(
		"../data/test_data.csv",
		function(d) { return { "text": d.text, "value": +d.value } },
		function(data) {
			draw(data, 0);
		}
	);

	function draw(data, page) {
		if (num_bars < 1) {
				alert('Cannot have fewer than 1 bar!');
		} else {

			data.sort(value_comparison);

			truncated_data = truncate_data(data);
			//truncated_data = data.slice(num_bars * page, num_bars * (page + 1));

			x.domain([0, d3.max(truncated_data, function(d) { return d.value })]);
			y.domain(truncated_data.map(function(d) {return d.text}));

	      	svg.select('.x.axis').transition().duration(500).call(xAxis);
	      	svg.select('.y.axis').transition().duration(500).call(yAxis);

	      	var bars = svg.selectAll(".bar")
	      		.data(truncated_data);

	      	bars.exit().transition().duration(500).style("fill-opacity", 0).remove();

	      	console.log('here');
	      	bars.enter().append("rect")
	      		.attr("class", "bar")
	      		.style("fill", "steelblue")
	      		.attr("y", function(d) { return y(d.text); })
	      		.attr("height", .95 * y.bandwidth())
	      		.attr("x", 0)
	      		.attr("width", function(d) { return x(d.value); })
	      		.style("fill-opacity", 0)
	      		.on("mouseover", function(d) {
	      			d3.select(this).style("fill", "red");
	      		})
	      		.on("mouseout", function(d) {
	      			d3.select(this).style("fill", "steelblue");
	      		});
	      	
	      	svg.selectAll(".bar").transition().duration(500).style("fill-opacity", 1);
    	}
	}

	function value_comparison(a,b) {
		if (a.value < b.value) {
			return 1;
		} 

		if (a.value > b.value) {
			return -1;
		}
		return 0;
	};

	function truncate_data(data) {
		truncated_data = [];
		if (num_bars >= data.length) {
			truncated_data = data;
		} else {
			truncated_data = data.slice(0, num_bars - 1);
			truncated_data[num_bars - 1] = {
				"text": "~[" + (data.length - num_bars + 1) + " other keywords]~",
				"value": sum_other_values(data, num_bars -1)
			};
		}

		return truncated_data;
	}

	function sum_other_values(data, from_index) {
		sum = 0;
		for (var i = from_index; i < data.length; i++) {
			sum += data[i].value;
		}
		return sum;
	}

});