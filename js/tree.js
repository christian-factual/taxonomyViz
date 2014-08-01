function doLayout(treeData, parent) {
  var circleRadius = 4.5;
  var height = getMaxTreeWidth(treeData)*15;
  var width = 1300;
  var svg = parent.append("svg")
    .attr("height", height)
    .attr("width", width);
  var group = svg.append("g")
    .attr("transform", "translate("+(circleRadius*3)+")");

  var tree = d3.layout.tree()
    .size([height, width-(circleRadius*6)-20]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });
  updateLayout(treeData, treeData, tree, group, diagonal)
}

function updateLayout(source, root, tree, svg, diagonal) {
  var circleRadius = 4.5;
  var duration = 500;
  var fastDuration = 100;
  var nodes = tree.nodes(root);//here
  var links = tree.links(nodes);
  root.x0 = root.x;
  root.y0 = root.y;
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
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .attr("data-category-id", function(d) {
        return d.category_id;
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
        updateLayout(d, root, tree, svg, diagonal, i);
      });

  nodeEnter.append("circle")
      .attr("r", 1e-6) //making change for animation was 4.5
      .style("fill", function(d) {
        return d.children_saved ? getColor(d) : "#fff";
      })
      .style("stroke", function(d){
        return getColor(d);
      });

  nodeEnter.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.children ? "start" : "end"; })
      .attr("transform", function(d) {
          return d.children ? "translate(8)" : "translate(-8)";
      })
      .text(function(d) {return d.name['en']; })
      .style("fill-opacity", 1e-6);

  var nodeUpdate = node.transition()
                       .duration(duration)
                       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
            .attr("r", circleRadius)
            .style("fill", function(d){return d.children_saved ? getColor(d) : "#fff"; })
            .style("stroke", function(d){
              return getColor(d);
            });

  nodeUpdate.select("text")
            .attr("text-anchor", function(d) { return d.children ? "start" : "end"; })
            .attr("transform", function(d) {
              return d.children ? "translate(8)" : "translate(-8)";
            })
            .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
       .duration(fastDuration)
       .attr("transform", function(d) {
        //this is the line where the NaN is being used
        if(isNaN(root.x) || isNaN(source.x) ) {
          root.x = 0;
          root.x0 = 0;
        }
        return "translate(" + source.y + "," + source.x + ")";
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
    d.x0 = d.x;
    d.y0 = d.y;
  });

  mouseoverEvents();
}

function getMaxTreeWidth(treeData) {
  var depthCounts = {};
  (function aux(treeData, depth) {
    if (!(depth in depthCounts)) {
      depthCounts[depth] = 1;
    }
    else {
      depthCounts[depth]++;
    }
    if (treeData.children)
      treeData.children.forEach(function(child) {
        aux(child, depth+1);
      });
  })(treeData, 0);
  var maxCount = 0;
  for (var depth in depthCounts) {
    if (depthCounts[depth] > maxCount) {
      maxCount = depthCounts[depth];
    }
  }
  return maxCount;
}

function getTreeNodesAndLinks(treeData, height, width) {
  var tree = d3.layout.tree()
    .size([height, width]);

  var nodes = tree.nodes(treeData);
  var links = tree.links(nodes);

  return [nodes, links];
}

function doLayoutMike(root, parent) {
  var diameter = $('#treeVisContainer').width();
  var svg = parent.append("svg")
    .attr("height", diameter)
    .attr("width", diameter);
  var tree = d3.layout.tree()
      .size([360, diameter / 2 - 120])
      .separation(function(a, b) {
        if (a.depth == 0){
          return (a.parent == b.parent ? 1 : 2);
        }
        else{
          return (a.parent == b.parent ? 1 : 2) / a.depth;
        }
      });

  var diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  var group = svg.append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
  var i = 0;
  root.x0 = 0;
  root.y0 = 0;
  update(root, root, tree, group, diagonal, i);
}

function update(source, root, tree, svg, diagonal, i) {
  var duration = 500;
  var fastDuration = 100;
  var nodes = tree.nodes(root);//here
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
      .attr("data-category-id", function(d) {
        return d.category_id;
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
      .style("fill", function(d) {
        return d.children_saved ? getColor(d) : "#fff";
      })
      .style("stroke", function(d){
        return getColor(d);
      });

  nodeEnter.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) {
          return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
      })
      .text(function(d) {return d.name['en']; })
      .style("fill-opacity", 1e-6);

  var nodeUpdate = node.transition()
                       .duration(duration)
                       .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

  nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function(d){return d.children_saved ? getColor(d) : "#fff"; })
            .style("stroke", function(d){
              return getColor(d);
            });

  nodeUpdate.select("text")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) {
              if(d.depth==0){
                return "rotate(270)translate(-8)"
              }
              else{
                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
              }
            })
            .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
       .duration(fastDuration)
       .attr("transform", function(d) {
        //this is the line where the NaN is being used
        if(isNaN(root.x) || isNaN(source.x) ) {
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
    d.x0 = d.x;
    d.y0 = d.y;
  });

  mouseoverEvents();
}

function changeLanguage(language){
  d3.select("svg").selectAll("text")
    .text(function(d){
      return d.name[language];
    })
}

function mouseoverEvents() {
  d3.select("svg").selectAll(".node").on('mouseover', function(e) {
    highlightCategory(e.category_id);
  });
  d3.select("svg").selectAll(".node").on('mouseout', function(e) {
    unhighlightCategory(e.category_id);
  });
}

function highlightCategory(categoryID) {
  addActiveCategory(categoryID);
  addActiveParentCategory(categoryID);
}

function unhighlightCategory(categoryID) {
  removeActiveCategory(categoryID);
  removeActiveParentCategory(categoryID);
}

function addActiveCategory(categoryID) {
  var mainNode = d3.select('.node[data-category-id="' + categoryID + '"]');
  mainNode.classed('active', true);
  mainNode.select('circle').attr('r', 9);
}

function addActiveParentCategory(categoryID) {
  var nodeData = d3.select('.node[data-category-id="' + categoryID + '"]').data();
  var parent = nodeData[0].parent;
  if (parent == undefined) {
    return;
  } else {
    addActiveCategory(parent.category_id);
    addActiveParentCategory(parent.category_id)
  }
}

function removeActiveCategory(categoryID) {
  var mainNode = d3.select('.node[data-category-id="' + categoryID + '"]');
  mainNode.classed('active', false);
  mainNode.select('circle').attr('r', 4.5);
}

function removeActiveParentCategory(categoryID) {
  var nodeData = d3.select('.node[data-category-id="' + categoryID + '"]').data();
  var parent = nodeData[0].parent;
  if (parent == undefined) {
    return;
  } else {
    removeActiveCategory(parent.category_id);
    removeActiveParentCategory(parent.category_id)
  }
}

function getColor(d){
  // console.log("Degrees: ", d.x, "radius: ", d.y, " depth: ", d.depth);
  //ask mike & nayeon about the lighting***
  var light = .5 + .05 * d.depth
  if(d.y == 0){
    //this is the root
    d3.hsl(d.x, .5, d.y)
  }
  else{
    return d3.hsl(d.x, 1.0, light);
  }
}
