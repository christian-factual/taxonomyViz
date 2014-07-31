function parseInput(json){
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
		if(!_.isEmpty(json[key].parents)){
			var parent = json[key].parents[0];
			store[parent].children.push(entry);
		}
	}
	return store["1"];
}