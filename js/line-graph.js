function lineGraph(data) {

	var yearFormat = d3.time.format("%Y");

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

	// console.log(countryData);

	//BEGIN: BUTTONS

	d3.select("input.groups").on("click", function() {
		var groupData = makeGroupData(data);
		drawGraph(groupData);
	});

	d3.select("input.groups_unknown").on("click", function() {
		var groupData = makeGroupData(data);
		var filtered = groupData.filter(function(d) {
			return d.key !== "Unknown";
		});
		drawGraph(filtered);
	});

	d3.select("input.countries").on("click", function() {
		var groupData = makeCountryData(data);
		drawGraph(countryData);
	});

	d3.select("button#seventy").on("click", function() {
		var countryData = makeCountryData(data);
		var years = ["1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979"];
		var seventies = countryData.map(function(c) {
			var newyears = c.values.filter(function(y) {
				return years.indexOf(y.key) !== -1;  // that means it's a year that matches the list
				years
			});
			return {key: c.key, values: newyears}
		});
		drawGraph(seventies);
		d3.select("p.decadesstory").html("<div style='background-color:#ACCFCC; padding:.8em;'><b>The 1970's</b> witnessed a rise in terrorism in <b>Italy</b> due to the Years of Lead, a time of socio-economic turmoil between the Red Brigades and the fascist government. In <b>Spain</b>, the Basque National Liberation Movement looked to gain their independence by inspiring fear in the Spanish government through a series of attack on top members of the administration. In the late 1970s, <b>El Salvador</b> began witnessing a rapid rise in terrorist attacks part of the Salvadoran civil war that would carry on well into the 90's </div>");
	});


	d3.select("button#eighties").on("click", function() {
		var countryData = makeCountryData(data);
		var years = ["1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989"];
		var eighties = countryData.map(function(c) {
			var newyears = c.values.filter(function(y) {
				return years.indexOf(y.key) !== -1;  // that means it's a year that matches the list
				years
			});
			return {key: c.key, values: newyears}
		});
		drawGraph(eighties);
		d3.select("p.decadesstory").html("<div style='background-color:#aab2c2; padding:.8em;'><b>The 1980's</b> were a time of turmoil for many parts of South America. In <b>Peru</b>, terrorist group Shining Path shook the country and even took the Japanese embassy. In <b>Colombia</b>, with the support of international communist parties and money from dug trafficking, criminal groups consolidated and in response, terrorist groups organized. The line between the two is blurred as they both committed terrorist attacks at one point or another. In 1984 <b>Chile</b> saw its biggest spike in terrorism during the height of Augusto Pinochet's regimen.</div>");
	});


	d3.select("button#nineties").on("click", function() {
		var countryData = makeCountryData(data);
		var years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999"];
		var nineties = countryData.map(function(c) {
			var newyears = c.values.filter(function(y) {
				return years.indexOf(y.key) !== -1;  // that means it's a year that matches the list
				years
			});
			return {key: c.key, values: newyears}
		});
		drawGraph(nineties);
		d3.select("p.decadesstory").html("<div style='background-color:#ffe8c6; padding:.8em;'>In <b>the 1990's</b>, Colombia saw its biggest spike of terrorism mainly attributed to the Revolutionary Armed Forces of Colombia. In 1995, Pakistan witnessed the first suicide terrorist documented in history. Pakistan became a main target of terrorism by jihadi groups after its government decided to side with the international community on its stance against Islamic extremists.</div>");
	});

	d3.select("button#thousands").on("click", function() {
		var countryData = makeCountryData(data);
		var years = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009"];
		var thousands = countryData.map(function(c) {
			var newyears = c.values.filter(function(y) {
				return years.indexOf(y.key) !== -1;  // that means it's a year that matches the list
				years
			});
			return {key: c.key, values: newyears}
		});
		drawGraph(thousands);
		d3.select("p.decadesstory").html("<div style='background-color:#D8EDF2; padding:.8em;'>The number of terrorist incidents in the Middle East, particularly Afghanistan, Pakistan and Iraq have been on a steady climb since the early <b>2000s</b>, up until the insurgency in 2008 that brought about an unprecedented number of attacks mostly all lead by Al Qaeda. In 2011, once the United States withdrew from Iraq, Al Qaeda freed hundreds of prisoners and set off a new wave of terrorist cells.</div>");
	});

	d3.select("button#thousandtens").on("click", function() {
		var countryData = makeCountryData(data);
		var years = ["2010", "2011", "2012", "2013", "2014"];
		var thousandtens = countryData.map(function(c) {
			var newyears = c.values.filter(function(y) {
				return years.indexOf(y.key) !== -1;  // that means it's a year that matches the list
				years
			});
			return {key: c.key, values: newyears}
		});
		drawGraph(thousandtens);
	});

	// draw the initial axes
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

	drawGraph(countryData);

	//END: BUTTONS

	//BEGIN: DRAWGRAPH FUNCTION

	function drawGraph(data) {

		//update scales for the current data set
		updateScalesIncidents(data);

		var groups = chart1.selectAll("g.lines")
			.data(data);

		groups
			.enter()
			.append("g")
			.attr("class", "lines")
			.on("mouseover", mouseoverFunc)
			.on("mousemove", mousemoveFunc)
			.on("mouseout",	mouseoutFunc);

		// APPEND LABELS HERE

		groups.exit()
			.remove();

		var lines = groups.selectAll("path")
			.data(function(d) {
				return [ d.values ];
			});


			lines
			.enter()
			.append("path");

			lines.transition()
			.duration(1000)
			.attr("d", line);

			lines
			.classed("line", true)
			.style("stroke", function (d) {
				if (typeof(d[0]) !== "undefined" && (d[0].values.country == "Afghanistan" || d[0].values.country == "Iraq" || d[0].values.country == "Pakistan" || d[0].values.country == "Syria")) {
					return "#BEDB39"; 
				} else if (typeof(d[0]) !== "undefined" && (d[0].values.country == "Colombia" || d[0].values.country == "Peru" || d[0].values.country == "Peru" || d[0].values.country == "Chile")) {
					return "#962D3E";
				}
				else if (typeof(d[0]) !== "undefined" && (d[0].values.country == "El Salvador" || d[0].values.country == "Guatemala")) {
					return "#ACCFCC";
				}
				else if (typeof(d[0]) !== "undefined" && (d[0].values.country == "Ukraine" || d[0].values.country == "Ireland" || d[0].values.country == "United Kingdom" || d[0].values.country == "Italy" || d[0].values.country == "Spain" || d[0].values.country == "France")) {
					return "#7E8AA2";
				}
				else if (typeof(d[0]) !== "undefined" && (d[0].values.country == "Somalia" || d[0].values.country == "Nigeria" || d[0].values.country == "Algeria" || d[0].values.country == "Egypt" || d[0].values.country == "Libya")) {
					return "#00585F";
				} else if (typeof(d[0]) !== "undefined" && (d[0].values.country == "Philippines" || d[0].values.country == "Thailand" || d[0].values.country == "Yemen" || d[0].values.country == "Turkey" || d[0].values.country == "India" || d[0].values.country == "Israel")) {
					return "#FFD393";
				} else if (typeof(d[0]) !== "undefined" && (d[0].values.group == "Taliban" || d[0].values.group == "Boko Haram" || d[0].values.group == "Al-Qa'ida in the Arabian Peninsula AQAP" || d[0].values.group == "Al-Qa'ida in Iraq")) {
					return "#343642";
				}
				else if (typeof(d[0]) !== "undefined" && (d[0].values.group == "Islamic State of Iraq and the Levant (ISIL)" || d[0].values.group == "Al-Shabaab")) {
					return "#348899";
				}
				else if (typeof(d[0]) !== "undefined" && (d[0].values.group == "Taliban")) {
					return "pink";
				}
				else {
					return "#DEDEDE";
				}
			})
			.on("mouseover", mouseoverFunc)
			.on("mousemove", mousemoveFunc)
			.on("mouseout",	mouseoutFunc);

			lines.exit().remove();

		chart1.select("g.x.axis").transition().call(xAxis);
		chart1.select("g.y.axis").transition().call(yAxis);

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

		/*
	var valuesForXScale = d3.merge(topCountriesForLine.map(function(d) {return d.values;}));
	var valuesForYScale = valuesForXScale.map(function(d) {return d.values;});

	xScale.domain(
		d3.extent(valuesForXScale, function(d) {
			return yearFormat.parse(d.key);
		}));

	yScale.domain([1500,0]); */

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

	d3.select("p.story").html("Group Text"); // HOW TO APPEND STORY?

	return topGroupsForLine;

	}

	function updateScalesIncidents(data) {

	var valuesForXScale = d3.merge(data.map(function(d) {return d.values;}));
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
	}

}; // end of linegraph


d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
    	});
}
