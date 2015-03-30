'use strict';

angular.module('mindmapModule').factory('IndexedDBProvider', ['$q', function($q){

	if(!'indexedDB' in window){
		window.indexedDB =  window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	}
	
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;

	var databaseVersion = 1.0,
		mindMapRequest,
		mindMapDataBase = {};
	
	mindMapDataBase.db = null;

	var _init = function(objectStoreName, properties){
		var deferred = $q.defer();

		mindMapRequest = mindMapRequest || window.indexedDB.open('MindMapDataBase', databaseVersion);


		mindMapRequest.onerror = function(event){
			console.log('database error number : '+ event.target.errorCode);
		}

		mindMapRequest.onsuccess = function(event){
			mindMapDataBase.db = event.target.result;
			deferred.resolve();
		};

		mindMapRequest.onupgradeneeded = function(event){
			mindMapDataBase.db = event.target.result;
			mindMapDataBase.db.createObjectStore(objectStoreName, properties);
		};
		return deferred.promise;
	}
	var _createTransaction = function(columnName){
		var transaction = mindMapDataBase.db.transaction([columnName], 'readwrite');
		transaction.oncomplete = function(event){
			console.log('transaction done without error');
		}
		transaction.onerror = function(event){
			console.log('transaction on error ');
		}
		return transaction;

	};

	function IndexedDBProvider(objectStoreName, properties){
		_init(objectStoreName, properties);
		this.save = function(data){
			if(!mindMapDataBase.db){
				_init(objectStoreName, properties).then(function(){
					var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName);
					var request = objectStore.add(data);
				})
			}else {
				var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName);
				var request = objectStore.add(data);
			}
		};

		this.get = function(id){
			var deferred = $q.defer();
			if(!mindMapDataBase.db){
				_init(objectStoreName, properties).then(function(){
					var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName);
					var resultat = objectStore.get(id);
					resultat.onsuccess = function(event){
						deferred.resolve(event.target.result);
					}
				})
			}else {
				var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName);
				var resultat = objectStore.get(id);
				resultat.onsuccess = function(event){
					deferred.resolve(event.target.result);
				}
			}
			return deferred.promise;
		};

		this.update = function(data){
			if(!mindMapDataBase.db){
				_init(objectStoreName, properties).then(function(){
					var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName);
					objectStore.put(data);
				});
			}else {
				var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName);
				objectStore.put(data);
			}
		};

		this.getAll = function(){
			var deferred = $q.defer();
			if(!mindMapDataBase.db){
				_init(objectStoreName, properties).then(function(){
				  var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName),
				  		keyRange = window.IDBKeyRange.lowerBound(0),
				  		cursorRequest = objectStore.openCursor(keyRange),
				  		results = [];

				  		cursorRequest.onsuccess = function(event){
				  			var result = event.target.result;
			  				if(result && result !== false){
			  					results.push(result.value);
			  					result.continue();
			  				} else {
			  					deferred.resolve(results);
			  				}
				  		}
				});
			}else {
				var objectStore = _createTransaction(objectStoreName).objectStore(objectStoreName),
				  	keyRange = window.IDBKeyRange.lowerBound(0),
				  	cursorRequest = objectStore.openCursor(keyRange),
			  		results = [];

			  		cursorRequest.onsuccess = function(event){
			  			var result = event.target.result;
		  				if(result && result !== false){
		  					results.push(result.value);
		  					result.continue();
		  				} else {
		  					deferred.resolve(results);
		  				}
			  		}
			}
			return deferred.promise;
		}
	}
	return IndexedDBProvider;
}]);