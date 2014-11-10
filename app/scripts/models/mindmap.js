'use strict';


angular.module('mindmapModule').factory('MindMap', [function(){

	function MindMap(data){
		if(data){
			this.id = data.id || null;
			this.name = data.name || null;
			this.root = data.root || null;
		} else {
			this.id = null;
			this.name = null;
			this.root = null;
		}
		
	}

	return MindMap;
}]);