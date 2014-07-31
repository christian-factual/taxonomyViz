function main() {
  $.getJSON("js/resources/factual_taxonomy.json", jsonCallback);
}

function jsonCallback(parsedJson) {
  var treeRoot = parseInput(parsedJson);
  var svg = d3.select("body").append("svg")
    .attr("height", 5000)
    .attr("width", 2250);
  doLayout(treeRoot, svg);
}
