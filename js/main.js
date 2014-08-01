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
  doLayoutMike(parsedTaxonomy, svg, diameter);
}
