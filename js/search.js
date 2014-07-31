function keyPress(){
    //on enter
    if (event.keyCode == 13) {
        $("#searchInput")
    //on colon
    }else if(event.keyCode == 186){
        $("#searchInput").autocomplete({
        source: Object.keys(keyTerms)
      });
    }
}