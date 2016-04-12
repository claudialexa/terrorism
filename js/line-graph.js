(function() {

var fullwidth = 1000;
				fullheight = 500;

			var color = d3.scale.ordinal()
  				.domain(["National Socialist German Workers Party (Nazi Party)", "Independent Social Democratic Party of Germany", "Social Democratic Party of Germany", "Communist Party of Germany", "Centre Party", "German National People's Party", "Bavarian People's Party", "German People's Party", "Christian Social People's Service", "German State Party", "German Farmers' Party", "Agricultural League", "Reich Party of the German Middle Class", "German-Hanoverian Party", "Radical Middle Class", "Christian-National Peasants' and Farmers' Party", "People's Justice Party", "Socialist Workers' Party of Germany"])
  				.range(["#000000", "#cccccc", "#3333ff", "#FF0000", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc", "#cccccc"]);

			var dateFormat = d3.time.format("%B %d %Y");

			var margin = {top: 20, right: 25, bottom: 20, left: 100};

			var width = fullwidth- margin.left - margin.right, 
				height = fullheight - margin.top - margin.bottom;

			// How can I access d.Party outside of nest?
			// var politicalParties = d3.nest()
			// 	.key(function (d){
			// 		return d.Party;
			// 	})

			var xScale = d3.time.scale().range([0, width]);
			var yScale = d3.scale.linear().range([0, height]);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(13)
				.innerTickSize([0]);

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.innerTickSize([0]);

			// Building Lines

			var line = d3.svg.line()
				.x(function (d) {
					return xScale(dateFormat.parse(d.Date));
				})
				.y(function (d) {
					return yScale(+d.Votes);
				});

			//Create the empty SVG image
			var svg = d3.select("body")
				.append("svg")
				.attr("width", fullwidth)
				.attr("height", fullheight)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var tooltip = d3.select("body")
	      	.append("div")
	      	.attr("class", "tooltip");
			

			d3.csv("data/german_elections_final.csv", function (error,data) {

				if (error) {
					console.log("error reading file");
				}

				var dataset = d3.nest()
					.key(function (d) {
						return d.Party;
					})
					.sortValues(function (a, b) {
						return dateFormat.parse(a.Date) - dateFormat.parse(b.Date)
					})
					.entries(data);

				xScale.domain(
					d3.extent(data, function(d) {
						return dateFormat.parse(d.Date);
					}));


				yScale.domain([
					d3.max(data, function(d) {
							return +d.Votes;
					}),
					0
					]);

				

				var groups = svg.selectAll("g.lines")
					.data(dataset)
					.enter()
					.append("g")
					.attr("class", "lines");

				groups.selectAll("path")
					.data(function(d) { 
						return [ d.values ];
					})
					.enter()
					.append("path")
					.attr("class", "line")
					.style("stroke", function(d) {
						return color(d[0].Party); })
					.attr("d", line); 

				var circles = groups.selectAll("circle")
								.data(function(d) { 
									return d.values; 
								})
								.enter()
								.append("circle");

			circles.attr("cx", function(d) {
						return xScale(dateFormat.parse(d.Date));
					})
					.attr("cy", function(d) {
						return yScale(d.Votes);
					})
					.style("opacity", 0.8)
					.style("fill", function(d) {
						return color(d.Party);
					})
					.attr("r", 4); 

				circles
					.on("mouseover", mouseoverFunc)
					.on("mousemove", mousemoveFunc)
					.on("mouseout",	mouseoutFunc);

	      	// Still need to fix line label ugh these go here


	      	//Axes
			svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

			svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				svg.append("text")
					.attr("class", "ylabel")
					.attr("transform","rotate(-90) translate(" + (-height/2) + ",0)")
					.style("text-anchor", "middle")
					.attr("dy", -80)
					.text("Votes");


			function mouseoverFunc(d) {
					d3.select(this)
						.transition()
						.style("opacity", 1)
						.attr("r", 10);
					tooltip
						.style("display", null) // this removes the display none setting from it
						.html("<p>Party: " + d.Party +
									"<br>Year: " + d.Date +
								  "<br>Votes: " + d.Votes + "</p>");
					}

				function mousemoveFunc(d) {
					tooltip
						.style("top", (d3.event.pageY - 10) + "px" )
						.style("left", (d3.event.pageX + 10) + "px");
					}

				function mouseoutFunc(d) {
					d3.select(this)
						.transition()
						.style("opacity", 1)
						.attr("r", 4);
			    tooltip.style("display", "none");  // this sets it to invisible!

			     }

			}); // end of data csv

})();