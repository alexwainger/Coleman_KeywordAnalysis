$(document).ready(function() {
	d3.csv("../data/test_data.csv", function(d) {return {"text": d.text, "value": +d.value}}, function(data) {
		var width = 1200,
			height = 500,
			minFontSize = 30,
			maxFontSize = 90,
			minOpacity = .4,
			maxOpacity = 1;

		svg = d3.select("#word_cloud")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g").attr("transform", "translate(" + width / 2 + ","  + height / 2 + ")");

		maxVal = d3.max(data, function(d) {return d.value});
		minVal = d3.min(data, function(d) {return d.value});

		opacity = d3.scaleLinear().domain([minFontSize, maxFontSize]).range([minOpacity, maxOpacity]);

		scaler = d3.scaleLinear().domain([minVal, maxVal]).range([minFontSize, maxFontSize]);
		
		d3.layout.cloud()
			.size([width, height])
			.words(data)
			.rotate(0)
			.fontSize(function(d) {return scaler(d.value)})
			.on('end', drawCloud).start();

		function drawCloud(words) {
			svg.selectAll('text').data(words).enter()
			.append('text')
			.style('font-size', function(d) { return d.size + 'px'; })
    		.style('font-family', function(d) { return d.font; })
    		.style('fill', function(d, i) { return "red"; })
    		.style('opacity', function(d, i) { return opacity(d.size)})
    		.attr('text-anchor', 'middle')
    		.attr('transform', function(d) {
      			return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
    		})
    		.text(function(d) { return d.text; })
			.on("mouseover", function(d) {
  				d3.select(this).style("fill", "steelblue");
			})
			.on("mouseout", function(d) {
  				d3.select(this).style("fill", "red");
			});
		};

	});
});