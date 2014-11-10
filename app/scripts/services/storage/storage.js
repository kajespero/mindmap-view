'use strict';

angular.module('mindmapModule').service('StorageService', ['StorageProvider', function(storageProvider){

	this.get = function(id){
		return storageProvider.get(id);
	};

	this.save = function(node){
		storageProvider.save(node);
	};

	this.update = function(node){
		storageProvider.update(node);
	};

	this.getAll = function(){
		return storageProvider.getAll();
	}
}]);