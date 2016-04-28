
	d3.csv("data/terrorism-clean-data.csv", function (error, data) {

		var yearFormat = d3.time.format("%Y");

		if (error) {
			console.log("error reading file");
		}

	function makeChart1() {

	var fullwidth = 800;
	var fullheight = 600;

	var color = d3.scale.category10();

	var chart1margin = {top: 20, right: 100, bottom: 20, left: 100};

	var width = fullwidth- chart1margin.left - chart1margin.right,
		height = fullheight - chart1margin.top - chart1margin.bottom;

	var xScale = d3.time.scale().range([0, width]);
	var yScale = d3.scale.linear()
				.range([0, height])

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(15)
		.innerTickSize([0]);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(15)
		.innerTickSize([0]);

	var line = d3.svg.line()
		.x(function (d) { return xScale(yearFormat.parse(d.key));
		})
		.y(function (d) {
			return yScale(d.values.incidents);
		});

	var chart1 = d3.select("#chart1")
		.append("svg")
		.attr("width", fullwidth)
		.attr("height", fullheight)
		.append("g")
		.attr("transform", "translate(" + chart1margin.left + "," + chart1margin.top + ")");

	var tooltip = d3.select("body")
  	.append("div")
  	.attr("class", "linetooltip");

	//CURRENT DATA//

	var countryData = makeCountryData(data);
	drawGraph(countryData);

	console.log(countryData);

	//BEGIN: BUTTONS

	d3.select("button#groups").on("click", function() {
		var groupData = makeGroupData(data);
		drawGraph(groupData);

		d3.select("p.story").text("Groups Story");
	});

	d3.select("button#countries").on("click", function() {
		var groupData = makeCountryData(data);
		drawGraph(countryData);

		d3.select("p.story").text("Countries Story");
	});

	d3.select("button#seventy").on("click", function() {
		var groupData = makeCountryData(data);
		drawGraph(countryData);
		rescale70s(); 
	});

	//END: BUTTONS

	//BEGIN: DRAWGRAPH FUNCTION

	function drawGraph(data) {

		var color = d3.scale.category10();

		var groups = chart1.selectAll("g.lines")
			.data(data);

		groups
			.enter()
			.append("g")
			.attr("class", "lines")
			// .style("stroke", "gray")
			.on("mouseover", mouseoverFunc)
			.on("mousemove", mousemoveFunc)
			.on("mouseout",	mouseoutFunc);

		// QUESTION: HOW DO I GET LAST VALUE OF EACH LINE TO APPEND LABELS (for country and terrorist incidents?
		groups.append("text")
			.datum(function(d) {
				var lastx = d.values[d.values.length-1] // how can I access the key which is the last year? the last incident for the last year is in here how can I get it out?
				// var lasty = d.incidents.length-1]
				// console.log(d.key, lastx, lasty);
			})

		groups.exit()
			.remove();

		var lines = groups.selectAll("path")
			.data(function(d) {
				return [ d.values ];
			})
			.attr("x", 3)
	      	.attr("dy", 3)
	      	.text(function(d) {
	      		return d.country;
	      	})
	      	.style("stroke", function (d) {
				return color (d.country);
			})
	      	.classed("linelabel", true);

			lines
			.enter()
			.append("path")
			// .style("stroke", function (d) {
			// 	return color (d.country);
			// })
			.attr("class", "line")
			.on("mouseover", mouseoverFunc)
			.on("mousemove", mousemoveFunc)
			.on("mouseout",	mouseoutFunc);
			

			lines.transition()
			.duration(1000)
			.attr("d", line); 


			lines.exit().remove();


		var circles = groups.selectAll("circle")
			.data(function(d) {
				return d.values;
			});

			circles
			.enter()
			.append("circle");

			circles.transition()
			.attr("cx", function(d) {
				return xScale(yearFormat.parse(d.key));
			})
			.attr("cy", function(d) {
				return yScale(+d.values.incidents);
			})
			// .style("fill", function (d) {
			// 	return color(d.values.incidents);
			// })
			.duration(2000)
			.attr("r", 0);

		circles.exit().remove();

		d3.select("p.story").text("Countries Story");

		d3.selection.prototype.moveToFront = function() {
		      return this.each(function(){
		        this.parentNode.appendChild(this);
		    	});
		}

		function mouseoverFunc(d) {
			d3.select(this)
				.transition()
				.style("opacity", 1)
				.attr("stroke", 10);
			tooltip
				.style("display", null) // this removes the display none setting from it
				.html("<p>" + d.key + "</p>");

			d3.select(this).select("path").attr("id", "focused");
			d3.select(this).select("text").classed("hidden", false);  // show it if "hidden"
			d3.select(this).select("text").classed("bolder", true);
			d3.select(this).moveToFront();
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
				.attr("r", 3);
	    	tooltip.style("display", "none");  // this sets it to invisible!

	    	d3.select(this).select("path").attr("id", null); 
	     }


  	} //END: DRAWGRAPH FUNCTION

  	//BEGIN: AXES - They are the same for all 

	chart1.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	chart1.append("g")
			.attr("class", "y axis")
			.call(yAxis);

	chart1.append("text")
			.attr("class", "ylabel")
			.attr("transform","rotate(-90) translate(" + (-height/2) + ",0)")
			.style("text-anchor", "middle")
			.attr("dy", -80)
			.text("Incidents");

	// END: AXES - They are the same for all 

  	function makeCountryData(data) {

	  var countryByYear = d3.nest()
     .key(function(d) { return d.country_txt; })
     .sortKeys(d3.ascending)
     .key(function(d) {return d.iyear;})
     .sortKeys(function(a,b) {
     	return d3.ascending(yearFormat.parse(a), yearFormat.parse(b));
     })
     .rollup(function(leaves) { 
     		return { "incidents": leaves.length, 
     		"deaths": d3.sum(leaves, function(d) { return +d.nkill; }),
     		"country" : leaves[0].country_txt
          };
      })
      .entries(data);

	var totalIncidents = d3.nest()
	  .key(function(d) { return d.country_txt; })
	  .rollup(function(v) { return v.length; })
	  .entries(data);

    function top50countries(totalIncidents) {
        return totalIncidents.sort(function (a, b) {
            return d3.descending(a.values, b.values);
        }).slice(0,100);
    }

    var topIncidents = top50(totalIncidents);

   	var topCountriesByIncidentsNames = topIncidents.map(function (d) {return d.key;}); // country names

	var topCountriesForLine = countryByYear.filter(function(d) {
		return topCountriesByIncidentsNames.indexOf(d.key) !== -1;
	});
		// console.log(topCountriesForLine)
		// structure is key: country, { key: year, values: deaths incident}
	var valuesForXScale = d3.merge(topCountriesForLine.map(function(d) {return d.values;}));
	var valuesForYScale = valuesForXScale.map(function(d) {return d.values;});

	xScale.domain(
		d3.extent(valuesForXScale, function(d) {
			return yearFormat.parse(d.key);
		}));

	yScale.domain([1500,0]);

	return topCountriesForLine;
	}

		// HOW CAN I MAKE A RESCALE OF THE XSCALE WORK TO REDRAW THE DOMAIN BY DECADES? THANK YOU!!!

		function rescale70s() {
            xScale.domain([1970, 1979])
            chart1.select("x axis")
                    .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
                    .call(xAxis);  
            // vis.select(".x.axis text")
            //     .text("Rescaled Axis");
        }

		function top50(totals) {
        return totals.sort(function (a, b) {
            return d3.descending(a.values, b.values);
        }).slice(0,100);
        }

		function makeGroupData(data) {

			var groupByYear = d3.nest()
	     .key(function(d) { return d.gname; })
	     .sortKeys(d3.ascending)
	     .key(function(d) {return d.iyear;})
	     .sortKeys(function(a,b) {
	     	return d3.ascending(yearFormat.parse(a), yearFormat.parse(b));
	     })
	     .rollup(function(leaves) { return { 
	     	"incidents": leaves.length, 
	     	"deaths": d3.sum(leaves, function(d) { return +d.nkill; }),
	     	"group": leaves[0].gname
	          };
	      })
	     .entries(data);

	     // console.log(groupByYear);

		var totalGroupIncidents = d3.nest()
		  .key(function(d) { return d.gname; })
		  // .key(function(d) { return d.iyear; })
		  .rollup(function(v) { return v.length; })
		  .entries(data);

	  // console.log(totalGroupIncidents);

    var topIncidents = top50(totalGroupIncidents);
    // console.log(topIncidents);

   	var topGroupsByIncidentsNames = topIncidents.map(function (d) {return d.key;}); // country names

	var topGroupsForLine = groupByYear.filter(function(d) {
		return topGroupsByIncidentsNames.indexOf(d.key) !== -1;
	});

	// structure is key: country, { key: year, values: deaths incident}

	var valuesForXScale = d3.merge(topGroupsForLine.map(function(d) {return d.values;}));
	var valuesForYScale = valuesForXScale.map(function(d) {return d.values;});

	xScale.domain(
		d3.extent(valuesForXScale, function(d) {
			return yearFormat.parse(d.key);
		}));


	yScale.domain([
		d3.max(valuesForYScale, function(d) {
				return d.incidents;
		}),
		0
		]);

	d3.select("p.story").html("Group Text"); // HOW TO APPEND STORY?

	return topGroupsForLine;

	}

	}

	makeChart1();

}); // end of data csv
