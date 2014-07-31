function keyPress(){
    //on enter
    if (event.keyCode == 13) {
        $("#searchInput").autocomplete({
        source: Object.keys(keyTerms)
      });
    }
}