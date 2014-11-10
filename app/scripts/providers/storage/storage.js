'use strict';

angular.module('mindmapModule').service('StorageProvider', ['IndexedDBProvider',function(indexedDBProvider){

	this.get = function(id){
		return indexedDBProvider.get(id);
	};

	this.save = function(node){
		indexedDBProvider.save(node);
	};

	this.update = function(node){
		indexedDBProvider.update(node);
	};

	this.getAll = function(){
		return indexedDBProvider.getAll();
	}

}]);