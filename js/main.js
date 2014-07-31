function main() {
  $.getJSON("js/resources/factual_taxonomy.json", jsonCallback);
}

function jsonCallback(parsedJson) {
  var treeRoot = parseInput(parsedJson);
  var svg = d3.select("body").append("svg")
    .attr("height", 4500)
    .attr("width", 4500);
  doLayout(treeRoot, svg);
}
