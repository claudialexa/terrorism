
	d3.csv("data/terrorism-clean-data.csv", function (error, data) {

		if (error) {
			console.log("error reading file");
		}

	function makeChart1() {

	var fullwidth = 1000;
	var fullheight = 500;
	var chart1Color = d3.scale.ordinal()

 	var yearFormat = d3.time.format("%Y");
	var chart1margin = {top: 20, right: 25, bottom: 20, left: 100};

	var width = fullwidth- chart1margin.left - chart1margin.right, 
		height = fullheight - chart1margin.top - chart1margin.bottom;

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

	// Begin, Problem

	var line = d3.svg.line()
		.x(function (d) {
			return xScale(yearFormat.parse(d.key)); //d.key is year
		})
		.y(function (d) {
			return yScale(d.values.incidents);
		});
	// End, Problem

	var chart1 = d3.select("#chart1")
		.append("svg")
		.attr("width", fullwidth)
		.attr("height", fullheight)
		.append("g")
		.attr("transform", "translate(" + chart1margin.left + "," + chart1margin.top + ")");

	var tooltip = d3.select("body")
  	.append("div")
  	.attr("class", "tooltip");

	// var years = ["1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014"];

	//BEGIN: Fixing Data

  	var countryByYear = d3.nest()
     .key(function(d) { return d.country_txt; })
     .sortKeys(d3.ascending)
     .key(function(d) {return d.iyear;})
     .sortKeys(function(a,b) {
     	return d3.ascending(yearFormat.parse(a), yearFormat.parse(b));
     })
     .rollup(function(leaves) { return { "incidents": leaves.length, "deaths": d3.sum(leaves, function(d) { return +d.nkill; })
          };
      })
      .entries(data);

	console.log(countryByYear);

	var totalIncidents = d3.nest()
	  .key(function(d) { return d.country_txt; })
	  // .key(function(d) { return d.iyear; })
	  .rollup(function(v) { return v.length; })
	  .entries(data);

	  console.log(totalIncidents);

    function top50countries(totalIncidents) {
        return totalIncidents.sort(function (a, b) {
            return d3.descending(a.values, b.values);
        }).slice(0,100);
    }

    var topIncidents = top50countries(totalIncidents);
    console.log(topIncidents);

   	var topCountriesByIncidentsNames = topIncidents.map(function (d) {return d.key;}); // country names

		var topCountriesForLine = countryByYear.filter(function(d) {
			return topCountriesByIncidentsNames.indexOf(d.key) !== -1;
		});

		// structure is key: country, { key: year, values: deaths incident}

		var valuesForXScale = d3.merge(topCountriesForLine.map(function(d) {return d.values;}));
		var valuesForYScale = valuesForXScale.map(function(d) {return d.values;});

	//END: Fixing Data

	// Begin: Making Scales (Problem)

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

	// End: Making Scales (Problem)

	var groups = chart1.selectAll("g.lines")
		.data(topCountriesForLine)
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
		//.style("stroke", function(d) {
		//	return chart1Color(d[0].Party); })
		.attr("d", line); 

	var circles = groups.selectAll("circle")
		.data(function(d) { 
			return d.values; 
		})
		.enter()
		.append("circle");

	circles.attr("cx", function(d) {
				return xScale(yearFormat.parse(d.key));
			})
			.attr("cy", function(d) {
				return yScale(+d.values.incidents);
			})
			.style("opacity", 0.8)
			//.style("fill", function(d) {
			//	return chart1Color(d.Party);
			//})
			.attr("r", 4); 

		circles
			.on("mouseover", mouseoverFunc)
			.on("mousemove", mousemoveFunc)
			.on("mouseout",	mouseoutFunc);

  	// Still need to fix line label ugh these go here


  	//Axes
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


	function mouseoverFunc(d) {
			d3.select(this)
				.transition()
				.style("opacity", 1)
				.attr("r", 10);
			tooltip
				.style("display", null) // this removes the display none setting from it
				.html("<p>Country: " + d.key + "</p>");
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

	}

	makeChart1();

	}); // end of data csv