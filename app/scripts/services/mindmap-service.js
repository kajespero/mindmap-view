'use strict';

angular.module('mindmapModule').service('MindmapService', ['$q', 'Utils', 'Node', 'MindMap', 'StorageProvider', 
	function($q, utils, Node, MindMap, StorageProvider){

	var storageProvider = new StorageProvider('mindmap');
	
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
		storageProvider.save(mindmap);
	};

	this.getAllMindMap = function(){
		var mindMapDeferred = $q.defer(),
			results = storageProvider.getAll();
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
			result = storageProvider.get(id);
		result.then(function(data){
			mindMapDeferred.resolve(new MindMap(data));
		});
		return mindMapDeferred.promise;
	};

	this.saveMindMap = function(mindmap){
		storageProvider.update(mindmap);
	}

	this.save = function(node){
		if(node.id){
			storageProvider.update(node);
		}else {
			node.id = utils.uuid();
			storageProvider.save(node);
		}
	};

	this.get = function(id){
		var nodeDeferred = $q.defer(),
			result = storageProvider.get(id);
		result.then(function(data){
			nodeDeferred.resolve(new Node(data));
		});
		return nodeDeferred.promise;
	};
}]);