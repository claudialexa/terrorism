
	d3.csv("data/terrorism-clean-data.csv", function (error, data) {

		var yearFormat = d3.time.format("%Y");

		if (error) {
			console.log("error reading file");
		}

	// BEGIN: MAKEchart2 FUNCTION. ALL UNIVERSAL VARIABLES

	function makechart2() {

	var margin = {top: 8, right: 10, bottom: 2, left: 10},
    width = 200 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

    var x = d3.time.scale()
    .range([0, width]);

	var y = d3.scale.linear()
    .range([height, 0]);

	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(5)
		.innerTickSize([0]);

	var area = d3.svg.area()
    .x(function(d) { return x(d.key); })
    .y0(height)
    .y1(function(d) { return y(d.values.incidents); });

	var line = d3.svg.line()
    .x(function(d) { return x(d.key); })
    .y(function(d) { return y(d.values.incidents); });

	//BEGIN: CALL CURRENT DATA//
	var regionData = makeRegionData(data);
	drawGraph(regionData);
	//END: CALL CURRENT DATA//

	//BEGIN: BUTTONS

	d3.select("button#asia").on("click", function() {
		var groupData = makeRegionDataAsia(data);
		drawGraph(RegionDataAsia);

		d3.select("p.story").text("Asia Story");
	});

	//END: BUTTONS

	function mouseoverFunc(d) {
	}

	
	function mousemoveFunc(d) {
	}


	function mouseoutFunc(d) {
	}

	function makeRegionData(data) {

	 var regionByYear = d3.nest()
     .key(function(d) { return d.region_txt; })
     .sortKeys(d3.ascending)
     .key(function(d) {return d.iyear;})
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
    		d.maxIncidents = d3.min(d.values, function(d) { return +d.values.incidents; });
		  });

		x.domain([
		d3.min(regionByYear, function(d) { return d.key; }),
		d3.max(regionByYear, function(d) { return d.key; })
		]);

		var chart2 = d3.select("#chart2")
	      .data(regionByYear)
	      .enter().append("svg")
	      .attr("width", width + margin.left + margin.right)
	      .attr("height", height + margin.top + margin.bottom)
	      .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    chart2.append("path")
      	.attr("class", "area")
      	.attr("d", function(d) { y.domain([0, d.maxIncidents]); return area(+d.values.incidents); });

      	chart2.append("path")
      	.attr("class", "line")
      	.attr("d", function(d) { y.domain([0, d.maxIncidents]); return line(+d.values.incidents); });

    }

} //END: MAKECHART2

	makechart2();

}); // end of data csv

