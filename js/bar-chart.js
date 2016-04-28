
function barChart(data) {

        var yearFormat = d3.time.format("%Y");

<<<<<<< HEAD
=======
        if (error) {
            console.log("error reading file");
        }

    function makeChart3() {

>>>>>>> origin/gh-pages
    var fullWidth = 900;
    var fullHeight = 600;

    // Setting up the Margins Here

    var margin = {top: 20, right: 100, bottom: 50, left: 250};

    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;

    var widthScale = d3.scale.linear()
        .range([0, width]);

    var heightScale = d3.scale.ordinal().rangeRoundBands([0,height], 0.4);

    // d3.select("#deaths")
    //     .on("click", function(d,i) {
    //         d3.select(this).classed("selected", true);
    //         d3.select("#data2").classed("selected", false);
    //         redraw(deathsData);
    //     });
    // d3.select("#terrorattacks")
    //     .on("click", function(d,i) {
    //         d3.select(this).classed("selected", true);
    //         d3.select("#data1").classed("selected", false);
    //         redraw(terrorData);
    //     });

    // Setting up the Axis Here

    var xAxis = d3.svg.axis()
        .scale(widthScale)
        .orient("bottom")
        .ticks(7);

    var yAxis = d3.svg.axis()
        .scale(heightScale)
        .orient("left")
        .innerTickSize([0]);

    var svg = d3.select("#chart3")
        .append("svg")
        .attr("width", fullWidth)
        .attr("height", fullHeight)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

<<<<<<< HEAD
=======

    d3.csv("data/terrorism-groups-deaths.csv", function(error, data){

        if (error) { 
            console.log("Had an error loading file.");
        }

        console.log(data);


>>>>>>> origin/gh-pages
        // Setting Up Scales
    widthScale.domain([0,15000]);
    heightScale.domain(data.map(function(d) {return d.group} ));

    var rects = svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");

        rects.attr("x", 0)

            .attr("y", function(d) {
                return heightScale(d.group);
            })
            .attr("width", function(d) {
                return widthScale(+d.deaths); // use your scale here:
            })
            .attr("height", heightScale.rangeBand())
            .style("fill" , function(d){

                if (d.category === "Islamic Fundamentalist") {
                    return "#343642";
                }
                else if (d.category === "Radical Political Leftists") {
                    return "#962D3E";
                }
                else if (d.category === "Jihadi Salafism") {
                    return "#348899";
                }
                else if (d.category === "Conservatism") {
                    return "#979C9C";
                }

                else if (d.category === "Separatists") {
                    return "#F2EBC7";
                }

                else if (d.category === "Shia Jihadism") {
                    return "#00585F";
                }

                else {
                    return "#DEDEDE";
                }

                
            })

            .append("title") 
            .attr("class", "tooltip") 
            .text(function(d) {
                return "Category:" + " " + d.category;
            });

        // Adding Axis information

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        // Label Axis

        svg.append("text")
            .attr("class", "xlabel")
            .attr("transform", "translate(" + width/2 + " ," +
                height + ")")
            .style("text-anchor", "middle")
            .attr("dy", "35")
            .text("Deaths");

}; // end of bar chart

