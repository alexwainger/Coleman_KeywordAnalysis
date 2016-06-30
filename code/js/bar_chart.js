$(document).ready(function() {
	var margin = {top: 20, right: 20, bottom: 20, left: 200},
		width = 980 - margin.left - margin.right,
		height = 640 - margin.top - margin.bottom,
		num_bars = 25;

	function value_comparison(a,b) {
		if (a.value < b.value) {
			return 1;
		} 

		if (a.value > b.value) {
			return -1;
		}
		return 0;
	};

	function sum_other_values(data, from_index) {
		sum = 0;
		for (var i = from_index; i < data.length; i++) {
			sum += data[i].value;
		}
		return sum;
	}


	d3.csv("../data/test_data.csv",
		function(d) { 
			return { "text": d.text, "value": +d.value }
		}, function(data) {
			if (num_bars < 1) {
				alert('Cannot have fewer than 1 bar!');
			} else {

				svg = d3.select("#bar_chart")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g").attr("transform", "translate(" + margin.left + ","  + margin.top + ")");

				data.sort(value_comparison);

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

				var x = d3.scaleLinear()
					.domain([0, d3.max(truncated_data, function(d) { return d.value })])
					.range([0, width]);

				var y = d3.scaleBand()
					.domain(truncated_data.map(function(d) {return d.text}))
					.range([0,height]);

				var xAxis = d3.axisBottom(x);
				var yAxis = d3.axisLeft(y);

				svg.append("g")
		      		.attr("class", "x axis")
		      		.attr("transform", "translate(0," + height + ")")
		      		.style("font", "12px sans-serif")
		      		.call(xAxis);

		  		svg.append("g")
		      		.attr("class", "y axis")
		      		.style("font", "12px sans-serif")
		      		.call(yAxis);

		      	svg.selectAll(".bar")
		      		.data(truncated_data)
		    		.enter().append("rect")
		      		.attr("class", "bar")
		      		.style("fill", "steelblue")
		      		.on("mouseover", function(d) {
		      			d3.select(this).attr("r", 10).style("fill", "red");
		      		})                  
		      		.on("mouseout", function(d) {
		      			d3.select(this).attr("r", 5.5).style("fill", "steelblue");
		      		})
		      		.attr("y", function(d) { return y(d.text); })
		      		.attr("height", .95 * y.bandwidth())
		      		.attr("x", 0)
		      		.attr("width", function(d) { return x(d.value); });
		    }
	});
});