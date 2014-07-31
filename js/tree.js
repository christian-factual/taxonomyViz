function doLayout(treeData, svg) {
  var group = svg.append("g")
    //.attr("transform", "translate(2250,2250)");
  var tuple = getTreeNodesAndLinks(treeData);
  var nodes = tuple[0];
  var links = tuple[1];

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  // create the link svg elements
  var linkCreator = group.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal);

  // create group elements to contain node
  // circles and text
  var nodeCreator = group.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.y +"," + d.x + ")";
    });

  // append node circles
  nodeCreator.append("circle")
    .attr("r", 4.5);

  // append node text
  nodeCreator.append("text")
    .attr("dy", ".31em")
    .attr("text-anchor", function(d) {
      return d.children ? "start" : "end";
    })
    .attr("dx", function(d) {
      return d.children ? 8 : -8;
    })
    .text(function(d) {
      return d.name["en"];
    });
}

function getTreeNodesAndLinks(treeData) {
  var tree = d3.layout.tree()
    .size([5000, 2250]);

  var nodes = tree.nodes(treeData);
  var links = tree.links(nodes);

  return [nodes, links];
}

function doLayoutMike(root, svg, diameter) {

  var tree = d3.layout.tree()
      .size([360, diameter / 2 - 120])
      .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var svg = svg.append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
  var i = 0;
  update(root, root, tree, svg, diagonal, i);
}

function update(node, root, tree, svg, diagonal, i) {
  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  var node = svg.selectAll(".node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

  var link = svg.selectAll(".link")
      .data(links, function(d) {
        return d.target.id;
      });
    link.enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  link.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .on("click", function(d) {
        if (d.children) {
          d.children_saved = d.children;
          d.children = null;
        }
        else {
          d.children = d.children_saved;
          d.children_saved = null;
        }
        update(d, root, tree, svg, diagonal, i);
      });

  node.exit().remove();

  nodeEnter.append("circle")
      .attr("r", 4.5);

  nodeEnter.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) {return d.name['en']; });
}

function changeLanguage(language){
  d3.select("svg").selectAll("text")
    .text(function(d){
      return d.name[language];
    })
}
