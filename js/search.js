populateSearchInput();

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

function populateSearchInput(){
    var searchInputOptions = "";
    for(var id in taxonomy) {
        var fullCategory = taxonomy[id];
        var relatedTerms = getKeyTerms(fullCategory);
        searchInputOptions+='<optgroup label="'+relatedTerms+'"><option value="'+id+'">'+fullCategory+'</option></optgroup><br>';
    }
    $("#searchInput").html(searchInputOptions);
}

$("#searchInput").chosen({no_results_text: "Oops, nothing found!"});

