
function barChart(data) {

    var fullWidth = 850;
    var fullHeight = 600;

    var margin = {top: 20, right: 100, bottom: 50, left: 20};

    var width = fullWidth - margin.left - margin.right;
    var height = fullHeight - margin.top - margin.bottom;

    var widthScale = d3.scale.linear()
        .range([0, width]);

    var heightScale = d3.scale.ordinal().rangeRoundBands([0,height], 0.4);

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

    var column = d3.select("#menu select").property("value");
    var dataset = top35_by_column(data, column);

        console.log(column, dataset);
        redraw(dataset, column);

    d3.select("#menu select")
        .on("change", function() {
            column = d3.select("select").property("value");
            dataset = top35_by_column(data, column);
            console.log(column, dataset);
            redraw(dataset, column);
    });

    function top35_by_column(data, column) {
        return data.sort(function (a, b) {
            return b[column] - a[column];
        }).slice(0,35);
    }

    var tooltip = d3.select("#chart3")
    .append("div")
    .attr("class", "linetooltip");

    function redraw(data, column) {

        console.log(column);

        var max = d3.max(data, function(d) {return +d[column];});

        xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width]);

        yScale = d3.scale.ordinal()
            .domain(d3.range(data.length))
            .rangeBands([0, height], .4);


        var bars = svg.selectAll("rect.bar")
            .data(data, function (d) { return d.group;}); 

        bars
            .attr("fill", function(d){

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

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d){

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
                    return "#BEDB39";
                }

                else if (d.category === "Shia Jihadism") {
                    return "#00585F";
                }

                else {
                    return "#DEDEDE";
                }
                
            });

        bars.exit()
            .transition()
            .duration(300)
            .attr("width", 0)
            .remove();

        bars
            .transition()
            .duration(300)
            .attr("width", function(d) {
                return xScale(+d[column]);
            })
            .attr("height", yScale.rangeBand())
            .attr("transform", function(d,i) {
                return "translate(" + [0, yScale(i)] + ")"
            });


        var labels = svg.selectAll("text.labels")
            .data(data, function (d) { return d.group;}); 

        labels.enter()
            .append("text")
            .attr("class", "labels");

        labels.exit()
            .remove();

        labels.transition()
            .duration(300)
            .text(function(d) {
                return d.group + " " + d[column];
            })
            .attr("transform", function(d,i) {
                    return "translate(" + xScale(+d[column]) + "," + yScale(i) + ")"
            })
            .attr("dy", "0.8em")
            .attr("dx", "3px")
            .attr("text-anchor", "start");


        } // end of draw function

}; // end of bar chart

