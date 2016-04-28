// SETTING UP SECTIONS

$(document).ready(function() {
	$('#fullpage').fullpage({
	    verticalCentered: true,
	    anchors: ['anchor1', 'anchor2', 'anchor3', 'anchor4', 'anchor5'],
	    sectionsColor: ['#ffffff', '#ffffff', '#ffffff']
	});
});

// READY

// function ready(error, data) {

// 	var yearFormat = d3.time.format("%Y");
// 		if (error) {
// 			console.log("error reading file");
// 		}
// }

// QUEUE

// queue()
//     .defer(d3.csv, "data/terrorism-clean-data.csv")
//     .defer(d3.csv, "data/terrorism-groups-deaths.csv")
//     .await(ready);
