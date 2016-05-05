
function smallMults(data) {

	var yearFormat = d3.time.format("%Y");


	// BEGIN: MAKEchart2 FUNCTION. ALL UNIVERSAL VARIABLES

	var margin = {top: 25, right: 15, bottom: 25, left: 15},
    width = 200 - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

	var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(4)
    .innerTickSize([0])
    .orient("bottom");

	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(4)
		.outerTickSize([0]);

	var area = d3.svg.area()
    .x(function(d) { 
    	return x(d.year); })
    .y0(height)
    .y1(function(d) { 
    	return y(+d.incidents); });

	var line = d3.svg.line()
    .x(function(d) { 
    	return x(d.year); })
    .y(function(d) { 
    	return y(+d.incidents); });

	//BEGIN: CALL CURRENT DATA//
	var regionData = makeRegionData(data);
	drawGraph(regionData);
	//END: CALL CURRENT DATA//

	function makeRegionData(data) {

	 var regionByYear = d3.nest()
     .key(function(d) { return d.region_txt; })
     .sortKeys(d3.ascending)
     .key(function(d) { return d.iyear; })
     .sortKeys(function(a,b) {
     	return d3.ascending(yearFormat.parse(a), yearFormat.parse(b));
     })
     .rollup(function(leaves) {
     		return { 
     		"incidents": leaves.length, 
     		"deaths": d3.sum(leaves, function(d) { return +d.nkill; }),
     		"region" : leaves[0].region_txt
          };
      })
      .entries(data);

      regionByYear.forEach(function(regions) {
      	regions.values.forEach(function(yr) {
      		yr.values.year = yearFormat.parse(yr.key);
      	});
      });

     console.log("with years", regionByYear);



	var totalRegionIncidents = d3.nest()
	.key(function(d) { return d.region_txt; })
	.rollup(function(v) { return v.length; })
	.entries(data);

	function top50regions(totalRegionIncidents) {
	    return totalRegionIncidents.sort(function (a, b) {
	        return d3.descending(a.values, b.values);
	    });
	}

		  function top50(totals) {
		    return totals.sort(function (a, b) {
		        return d3.descending(a.values, b.values);
		    });
		    }

		  var topRegionIncidents = top50(totalRegionIncidents);

		  var topRegionsByIncidentsNames = topRegionIncidents.map(function (d) {return d.key;}); // region names
		  var topRegionsForLine = regionByYear.filter(function(d) {
				return topRegionsByIncidentsNames.indexOf(d.key) !== -1;
			});

		  console.log(topRegionsForLine)

		  var valuesForXScale = d3.merge(topRegionsForLine.map(function(d) {return d.values;}));
		  var valuesForYScale = valuesForXScale.map(function(d) {return d.values;});

		  return topRegionsForLine;

		  console.log(topRegionsforLine)

    }

    function drawGraph(regionByYear) {

    	regionByYear.forEach(function(d) {
    		d.maxIncidents = d3.max(d.values, function(d) { return +d.values.incidents; });
		  });

		var dompath = container.select("div#section3 div.row div.col-sm-9 div#chart2");

		var chart2 = dompath.selectAll("svg")
	      .data(regionByYear)
	      .enter().append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	      .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    chart2.append("path")
      	.attr("class", "area")
      	.attr("d", function(d) { 
      		y.domain([0, d.maxIncidents]);
      		x.domain(d3.extent(d.values, function(x) {
      			return yearFormat.parse(x.key);
      		}));
      		var data = d.values.map(function(d) {
      			if (d.values) {
      				return d.values;
      			}
      		});
      		console.log(data);
      		return area(data);
      	});

      	chart2.append("path")
      	.attr("class", "line")
      	.attr("d", function(d) { 
      		y.domain([0, d.maxIncidents]);
      		x.domain(d3.extent(d.values, function(x) {
      			return yearFormat.parse(x.key);
      		}));
      		var data = d.values.map(function(d) {
      			if (d.values) {
      				return d.values;
      			}
      		});
      		console.log(data);
      		return line(data);
      	});

        chart2.append("text")
          .attr("class", "label")
          .attr("x", width/2)
          .attr("y", -8)
          .style("text-anchor", "middle")
          .text(function(d) {
            return d.key;
          });

        chart2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        // chart2.append("g") y axis showing up as 0....
        //   .attr("class", "y axis")
        //   .call(yAxis); 

    }

}; // end of function

