'use strict';


angular.module('mindmapModule').factory('StorageProvider', ['IndexedDBProvider', function(IndexedDBProvider){

	function StorageProvider(objectStoreName){
		var indexedDBProvider = new IndexedDBProvider(objectStoreName);
		
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
		}	;

		this.delete = function(id){
			
		}	
	}
	return StorageProvider;
}]);