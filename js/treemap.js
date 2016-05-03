// Tree map adapted from Mike Bostock https://bl.ocks.org/mbostock/4063582

function makeChart4(){

  var fullWidth = 800;
  var fullHeight = 600;

  var margin = {top: 20, right: 10, bottom: 50, left: 10};
  var width = fullWidth - margin.left - margin.right;
  var height = fullHeight - margin.top - margin.bottom;

  var color = d3.scale.category20();

  var treemap = d3.layout.treemap()
      .size([fullWidth, fullHeight])
      .sticky(true)
      .value(function(d) { return d.size; });

  var div = d3.select(".chart4")
      .append("div")
      .style("position", "relative")
      .style("width", (fullWidth + margin.left + margin.right) + "px")
      .style("height", (fullHeight + margin.top + margin.bottom) + "px")
      .style("left", margin.left + "px")
      .style("top", margin.top + "px");

  d3.json("data/aid.json", function(error, root) {
    if (error) throw error;

    var node = div.datum(root).selectAll(".node")
        .data(treemap.nodes)
      .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return d.children ? color(d.name) : null; })
        .text(function(d) { return d.children ? null : d.name; });

    d3.selectAll("input").on("change", function change() {
      var value = this.value === "count"
          ? function() { return 1; }
          : function(d) { return d.size; };

      node
          .data(treemap.value(value).nodes)
        .transition()
          .duration(1500)
          .call(position);
    });
  });

  function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
  }
}

makeChart4();