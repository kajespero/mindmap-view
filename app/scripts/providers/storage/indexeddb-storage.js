'use strict';

angular.module('mindmapModule').factory('IndexedDBProvider', ['$q', function($q){

	if(!'indexedDB' in window){
		window.indexedDB =  window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	}
	
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;

	var databaseVersion = 1.0,
			mindMapRequest,
			database,
			dataBasePromise;


	var _createConnection = function(){
		var promise = $q.defer();
		mindMapRequest = mindMapRequest || window.indexedDB.open('MindMapDataBase', databaseVersion);

		mindMapRequest.onupgradeneeded = function(event){
			database = event.target.result;
			database.createObjectStore('account', {keyPath : 'id'});
			database.createObjectStore('mindmap', {keyPath : 'id'});
			promise.resolve(database);
		};

		mindMapRequest.onsuccess = function(event){
			database = event.target.result;
			promise.resolve(database);
		};


		mindMapRequest.onerror = function(event){
			console.log('database error number : '+ event.target.errorCode);
			promise.reject();
		}
		return promise.promise;
	}

	var _openDataBase = function(){
		return dataBasePromise || (dataBasePromise = _createConnection()); 
	}

	var _createTransaction = function(database, columnName){
		var transaction = database.transaction([columnName], 'readwrite');
		transaction.oncomplete = function(event){
			// do nothing
		}
		transaction.onerror = function(event){
			console.log('transaction on error ');
		}
		return transaction;

	};

	function IndexedDBProvider(objectStoreName){
		this.save = function(data){
			_openDataBase().then(function(db){
				var objectStore = _createTransaction(db, objectStoreName).objectStore(objectStoreName);
				var request = objectStore.add(data);
			});
		};

		this.get = function(id){
			var deferred = $q.defer();
			_openDataBase().then(function(db){
				var objectStore = _createTransaction(db, objectStoreName).objectStore(objectStoreName);
				var resultat = objectStore.get(id);
				resultat.onsuccess = function(event){
					deferred.resolve(event.target.result);
				}
			});
			return deferred.promise;
		};

		this.update = function(data){
			_openDataBase().then(function(db){
				var objectStore = _createTransaction(database, objectStoreName).objectStore(objectStoreName);
				objectStore.put(data);
			});
		};

		this.getAll = function(){
			var deferred = $q.defer();
			_openDataBase().then(function(db){
				var objectStore = _createTransaction(db, objectStoreName).objectStore(objectStoreName),
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
			return deferred.promise;
		};

		this.delete = function(id){
			_openDataBase().then(function(db){
				var objectStore = _createTransaction(db, objectStoreName).objectStore(objectStoreName);
				objectStore.delete(id);
			})
		}
	}
	return IndexedDBProvider;
}]);