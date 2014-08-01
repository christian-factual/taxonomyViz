$(document).ready( function() {
    populateSearchInput(flatTaxonomy);

    function getKeyTerms(c){//c = "Retail > Food and Beverage > Beer, Wine and Spirits"
        var groupString = "";
        var keyTermsArray = parseFullCategory(c);//[Retail, Food, and, Beverage, Food and Beverage,..]
        for(i=0; i<keyTermsArray.length; i++){
            var keyTerm = keyTermsArray[i];
            if(keyTerm!="and"){
                keyTerm = keyTerm.toLowerCase();
                var synonyms = getSynonyms(keyTerm);//"syn, syn, syn,..."
                groupString += keyTerm+', '+synonyms;//groupString="keyword, syn, syn, syn, keyword, syn, syn, syn, " cut off last two char at end?
            }   
        }
        return groupString; //"retail, food, beverage, beer, wine, spirits, synonyms"
    }

    function parseFullCategory(s){
        var catWordsArray = [];
        var comboArray = [];
        catWordsArray = s.split(" > ");
        sj = s.split(" > ").join(" ");
        sj = sj.split(", ").join(" ");
        comboArray = catWordsArray.concat(sj.split(" "));
        return comboArray;
    }        
            
    function getSynonyms(word){ //word = "retail" "food and beverage"
        var synString = "";
        for(var key in synonyms){
            if(key == word && synonyms[key].length>0){
                var synArray = synonyms[key]; //["syn", "syn", "syn"...] 
                for(j=0; j<synArray.length; j++){
                    synString+=synArray[j]+', ';
                }
            }
        }
        return synString;
    }

    function populateSearchInput(taxonomy){
        var searchInputOptions = "";
        for(var id in taxonomy) {
            var fullCategory = taxonomy[id];
            var relatedTerms = getKeyTerms(fullCategory);
            relatedTerms = relatedTerms.substring(0, relatedTerms.length-2);
            searchInputOptions+='<optgroup label="'+relatedTerms+'"><option value="'+id+'">'+fullCategory+'</option></optgroup><br>';
        }
        $("#searchInput").html(searchInputOptions);
    }
   
    $("#searchInput").chosen({no_results_text: "Oops, Nothing found!", max_selected_options: 1}).change(function () {
        // console.log();
        if ($('#searchInput').chosen().val() == null) {
            unfreezeCategory();
        } else {
            freezeCategory($('#searchInput').chosen().val()[0]);
        }
    });
    // .change(function() {

    //     var finderNum = ($(this).data("option-array-index") - 1)/2;
    //     var validID = $("#searchInput option").eq(finderNum).val();
    //     console.log(validID);
    //     freezeCategory(validID);
    // });
    $(document).on("mouseenter",".active-result", function(){
        var finderNum = ($(this).data("option-array-index") - 1)/2;
        var validID = $("#searchInput option").eq(finderNum).val();
        highlightCategory(validID);
        populateInformation(validID);
    });
    $(document).on("mouseleave",".active-result", function(){
        var finderNum = ($(this).data("option-array-index") - 1)/2;
        var validID = $("#searchInput option").eq(finderNum).val();
        unhighlightCategory(validID);
        unpopulateInformation(validID);
    });
});

