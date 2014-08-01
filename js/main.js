function main() {
	$('#dropdown').change(function(){
		var lang = $('#dropdown').val(); //this should be the language
		changeLanguage(lang);
	});
	var parsedTaxonomy = parseInput(taxonomyJSON);
	jsonCallback(parsedTaxonomy);
}

function jsonCallback(parsedTaxonomy) {
  var diameter = $('#treeVisContainer').width();
  var svg = d3.select("#treeVisContainer").append("svg")
    .attr("height", diameter)
    .attr("width", diameter);

  $("#viewLinear").change(function() {
    svg.remove();
    svg = d3.select("#treeVisContainer").append("svg")
      .attr("height", diameter)
      .attr("width", diameter);
    doLayout(parsedTaxonomy, svg);
  });
  doLayoutMike(parsedTaxonomy, svg, diameter);
}
