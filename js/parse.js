function parseInput(json){
	var store = {};
	for(var key in json){
		var entry = json[key];
		var obj = {
			category_id: key,
			name: entry.labels,
			children: [],
			id: key
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
