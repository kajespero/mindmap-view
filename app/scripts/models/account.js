'use strict';

angular.module('mindmapModule').factory('Account', ['Utils', function(utils){

	function Account(data){
		if(data){
			this.id = data.id;
			this.speudo = data.speudo;
			this.firebaseKey = data.firebaseKey;
		} else {
			this.id = utils.uuid();
			this.speudo = 'anonymous';
			this.firebaseKey = null;
		}
	}
	return Account;
}]);