var categoryOptions = [];
for(var key in taxonomy) {
    var value = objects[key];
}

$(function() {
    var data = [
      { label: "Surf", category: "" },
      { label: "Restaurants", category: "" },
      { label: "Mexican", category: "" },
      { label: "American", category: "Did you mean..." },
      { label: "Sports", category: "Did you mean..." }
    ];
 
    $("#searchInput").autocomplete({
      delay: 0,
      source: data
    });
  });

function keyPress(){
    //on enter
//    if (event.keyCode == 13) {
//        $("#searchInput").autocomplete({
//        source: Object.keys(keyTerms)
//      });
//    }
}