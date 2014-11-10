'use strict';

angular.module('mindmapModule').service('MindmapService', ['$q', 'Utils', 'Node', 'MindMap', 'StorageService', function($q, utils, Node,MindMap ,storageService){
	
	this.create = function(idParent){
		var node = new Node();
		if(idParent){
			node = new Node();
			node.id = utils.uuid();
			node.parentId = idParent;
		}
		return node;
	};

	this.createMindMap = function(name){
		var mindmap = new MindMap({name: name});
		mindmap.id = utils.uuid();
		mindmap.root = new Node();
		return mindmap;
	};

	this.saveMindMap = function(mindmap){
		storageService.save(mindmap);
	};

	this.getAllMindMap = function(){
		var mindMapDeferred = $q.defer(),
			results = storageService.getAll();
		results.then(function(mindmaps){
			var list = [];
			mindmaps.forEach(function(data){
				list.push(new MindMap(data));
			})
			mindMapDeferred.resolve(list);
		});
		return mindMapDeferred.promise;
	};

	this.getMindMap = function(id){
		var mindMapDeferred = $q.defer(),
			result = storageService.get(id);
		result.then(function(data){
			mindMapDeferred.resolve(new MindMap(data));
		});
		return mindMapDeferred.promise;
	};

	this.saveMindMap = function(mindmap){
		storageService.update(mindmap);
	}

	this.save = function(node){
		if(node.id){
			storageService.update(node);
		}else {
			node.id = utils.uuid();
			storageService.save(node);
		}
	};

	this.get = function(id){
		var nodeDeferred = $q.defer(),
			result = storageService.get(id);
		result.then(function(data){
			nodeDeferred.resolve(new Node(data));
		});
		return nodeDeferred.promise;
	};
}]);