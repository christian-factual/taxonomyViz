function parseInput(json){
  console.log("json" + json);
	var store = {};
	for(var key in json){
		var entry = json[key];
		var obj = {
			name: entry.labels,
			children: []
		};
		store[key] = obj;
	}
	for(var key in store){
		var entry = store[key];
		if(json[key].parents.length > 0){
			var parent = json[key].parents[0];
			store[parent].children.push(entry);
		}
	}
	return store["1"];
}
