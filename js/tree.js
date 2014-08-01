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
  root.x0 = 0;
  root.y0 = 0;
  console.log(root);
  update(root, root, tree, svg, diagonal, i);
}

function update(source, root, tree, svg, diagonal, i) {
  var duration = 1750;
  var fastDuration = 750;
  console.log(root.x);

  var nodes = tree.nodes(root);//here
  
  console.log(root.x);

  var links = tree.links(nodes);
  var node = svg.selectAll(".node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

  var link = svg.selectAll(".link")
      .data(links, function(d) {
        return d.target.id;
      });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "rotate(" + (source.x0 - 90) + ")translate(" + source.y0 + ")"; 
      })
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

  nodeEnter.append("circle")
      .attr("r", 1e-6) //making change for animation was 4.5
      .style("fill", function(d) { return d.children_saved ? "lightsteelblue" : "#fff"; });
  
  nodeEnter.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) {return d.name['en']; })
      .style("fill-opacity", 1e-6);

  var nodeUpdate = node.transition()
                       .duration(duration)
                       .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

  nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d){return d.children_saved ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
            .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
       .duration(fastDuration)
       .attr("transform", function(d) { 
        console.log("here", root.x, source.x);
        if(isNaN(root.x) || isNaN(source.x)){
          root.x = 0;
          root.x0 = 0;
        }
        return "rotate(" + (source.x - 90) + ")translate(" + source.y + ")"; 
      })
       .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      });
  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(fastDuration)
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    console.log(d);
    if(isNaN(d.x)){
      d.x = 0;
      d.y = 0;
    }
    d.x0 = d.x;
    d.y0 = d.y;
    console.log(d.x);
  });
}

function changeLanguage(language){
  d3.select("svg").selectAll("text")
    .text(function(d){
      return d.name[language];
    })
}
