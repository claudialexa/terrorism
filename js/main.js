
var container = d3.select(".container");

function ready(error, data1, data2, data3) {

		if (error) {
			console.log("error reading file");
		}

	lineGraph(data1);
	smallMults(data1);
	barChart(data2);
	// treeMap(data3);

	
	$(document).ready(function() {
	
		$('#fullpage').fullpage({
	    verticalCentered: true,
	    autoScrolling:false,
	    anchors: ['anchor1', 'anchor2', 'anchor3', 'anchor4', 'anchor5'],
	    sectionsColor: ['#ffffff', '#ffffff', '#ffffff']
		});
	});

}

// QUEUE

queue()
	.defer(d3.csv, "data/terrorism-clean-data.csv")
	.defer(d3.csv, "data/terrorism-groups-deaths.csv")
	// .defer(d3.csv, "data/aid.json")
	.await(ready);
