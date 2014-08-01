populateSearchInput();

function populateSearchInput(){
    var searchInputOptions = "";
    for(var key in taxonomy) {
        var value = taxonomy[key];
        searchInputOptions+='<option value="'+key+'">'+value+'</option><br>';
    }
    $("#searchInput").html(searchInputOptions);
}


$("#searchInput").chosen({no_results_text: "Oops, nothing found!"});


//$(function() {
//    var data = [
//      { label: "Surf", category: "" },
//      { label: "Restaurants", category: "" },
//      { label: "Mexican", category: "" },
//      { label: "American", category: "Did you mean..." },
//      { label: "Sports", category: "Did you mean..." }
//    ];
// 
//    $("#searchInput").autocomplete({
//      delay: 0,
//      source: data
//    });
//  });

//function keyPress(){
//    //on enter
////    if (event.keyCode == 13) {
////        $("#searchInput").autocomplete({
////        source: Object.keys(keyTerms)
////      });
////    }
//}