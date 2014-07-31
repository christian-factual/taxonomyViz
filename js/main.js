function main() {
	$('.dropdown').change(function(){
		var lang = $('.dropdown').val(); //this should be the language
	});
	var parsedTaxonomy = parseInput(taxonomyJSON);
	jsonCallback(parsedTaxonomy);
}

function jsonCallback(parsedTaxonomy) {
  var diameter = 1500;
  var svg = d3.select("body").append("svg")
    .attr("height", diameter)
    .attr("width", diameter);
  doLayoutMike(parsedTaxonomy, svg, diameter);
}
