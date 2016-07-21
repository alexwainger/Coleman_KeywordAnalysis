$(document).ready(function() {
	d3.csv("../data/data.csv", function(d) {return {"text": d.text, "value": +d.value}}, function(data) {
		var width = 1200,
			height = 500,
			minFontSize = 25,
			maxFontSize = 80,
			minFontDifference = 15;
			minOpacity = .3,
			maxOpacity = 1,
			fontFamily = "serif",
			originalFontColor = "red",
			mouseOverFontColor = "steelblue",
			allowable_width_percentage = .8;

		var svg = d3.select("#word_cloud")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g").attr("transform", "translate(" + width / 2 + ","  + height / 2 + ")");

		var maxVal = d3.max(data, function(d) {return d.value});
		var minVal = d3.min(data, function(d) {return d.value});

		var median = d3.median(data.slice(0, data.length / 2), function(d) {return d.value});
		var average = d3.mean(data, function(d) {return d.value});
		var exponent;
		if (median > average) {
			exponent = 1.5;
		} else {
			exponent = .67;
		}

		maxFontSize = getMaxFontSize(maxFontSize, data.slice(0, data.length/2), exponent);

		var opacity = d3.scalePow().exponent(exponent).domain([minFontSize, maxFontSize]).range([minOpacity, maxOpacity]);
		var fontSize = d3.scalePow().exponent(exponent).domain([minVal, maxVal]).range([minFontSize, maxFontSize]);
		
		d3.layout.cloud()
			.size([width, height])
			.words(data)
			.rotate(0)
			.fontSize(function(d) {return fontSize(d.value)})
			.on('end', drawCloud).start();

		function drawCloud(words) {
			svg.selectAll('text').data(words).enter()
				.append('text')
    			.style('font-family', fontFamily)
    			.style('fill', originalFontColor)
    			.style('font-size', function(d) { return d.size + 'px'; })
    			.style('opacity', function(d, i) { return opacity(d.size)})
    			.attr('text-anchor', 'middle')
    			.attr('transform', function(d) {
	      			return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
    			})
    			.text(function(d) { return d.text; })
				.on("mouseover", function(d) {
	  				d3.select(this).style("fill", mouseOverFontColor).style("opacity", 1);
				})
				.on("mouseout", function(d) {
	  				d3.select(this).style("fill", originalFontColor).style("opacity", function(d) { return opacity(d.size) });
				});
		};

		function getMaxFontSize(desiredMax, data, exponent) {
			var test_scale = d3.scalePow().exponent(exponent).domain([minVal, maxVal]).range([minFontSize, desiredMax]);
			var curr_fontSize = desiredMax;
			var e = document.createElement('span');
  			$(document.body).append(e);

			data.forEach(function(el) {
				var proposed_size = curr_fontSize;
				while (measureFontSize(e, el, test_scale) > allowable_width_percentage * width && proposed_size - minFontSize > minFontDifference) {
					proposed_size--;
					test_scale = d3.scalePow().exponent(exponent).domain([minVal, maxVal]).range([minFontSize, proposed_size]);
				}

				if (measureFontSize(e, el, test_scale) <= allowable_width_percentage * width) {
					curr_fontSize = proposed_size;
				}
			});

			$(e).remove();
			return curr_fontSize;
		};

		function measureFontSize(e, el, scale) {
			$(e).css({
				"visibility": "hidden",
				"font-family": fontFamily,
				"font-size": scale(el.value)
			});

			$(e).text(el.text);
			return $(e).width();
		};
	});
});

