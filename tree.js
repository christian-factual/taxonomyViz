function doLayout(treeData, svg) {
  var tuple = getTreeNodesAndLinks(treeData);
  var nodes = tuple[0];
  var links = tuple[1];

  // project the tree into a circular pattern
  var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) {
      return [d.y, d.x / 180 * Math.PI];
    });

  // create the link svg elements
  var linkCreator = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal);

  // create group elements to contain node
  // circles and text
  var nodeCreator = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "rotate(" + (d.x - 90) + ")translate(" + d.y +")";
    });

  // append node circles
  nodeCreator.append("circle")
    .attr("r", 4.5);

  // append node text
  nodeCreator.append("text")
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) {
      return d.x < 180 ? "start" : "end";
    })
    .attr("transform", function(d) {
      return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
    })
    .text(function(d) {
      return d.name;
    });
}

function getTreeNodesAndLinks(treeData) {
  var tree = d3.layout.tree()
    .size([700, 700])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });

  var nodes = tree.nodes(treeData);
  var links = tree.links(nodes);

  return [nodes, links];
}
