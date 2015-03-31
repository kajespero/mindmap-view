'use strict';

var url = 'https://luminous-heat-6241.firebaseio.com/';

angular.module('mindmapModule').factory('FirebaseProvider',['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){

	function FirebaseProvider(uri){
		var _completeUrl = url + uri, 
				firebase = new Firebase(_completeUrl);

		this.getArray = function(){
			return $firebaseArray(firebase);
		}

		this.getObject = function(){
			return $firebaseObject(firebase);
		}
	}

	return FirebaseProvider;
}]);