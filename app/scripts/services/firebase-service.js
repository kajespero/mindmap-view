'use strict';

angular.module('mindmapModule').service('FirebaseService',['$q','FirebaseProvider', 'StorageProvider', 'Account',
	function($q, FirebaseProvider, StorageProvider, Account){

	var storageProvider = new StorageProvider('account'),
			firebaseProvider = new FirebaseProvider('accounts'),
			accountsFirebase = firebaseProvider.getArray(),
			myAccountFirebase, 
			myAccount;

	this.getAccount = function(){
		var accountDefer = $q.defer(),
				accounts = storageProvider.getAll();
		accounts.then(function(data){
			// we can only have one account 
			if(data && data.length === 0){
				// empty result is a first time user is connected
				// create it with a firebase ref
				var account = new Account();
				accountsFirebase.$add(account).then(function(ref){
					account.firebaseKey = ref.key();
					storageProvider.save(account);
					myAccount = account;
					
					accountsFirebase.$save(account);
					accountDefer.resolve(account);
					
				});
			} else {
				accountsFirebase.$loaded(function(){
					var account = myAccount = new Account(data[0]),
							ref = accountsFirebase.$getRecord(account.firebaseKey);
					if(ref){
						accountDefer.resolve(myAccount);
					} else {
						// delete latest account 
						storageProvider.delete(account.id);
						// and recreate a new one for now
						// todo saved a partial old data such as name
						account.firebaseKey = null;
						accountsFirebase.$add(account).then(function(ref){
							account.firebaseKey = ref.key();
							storageProvider.save(account);
							myAccount = account;
							accountDefer.resolve(account);
						});
					}	
				});
			}
		});
	
		return accountDefer.promise;
	};

	this.getUsers = function(){
		var result = $q.defer(),
				users = [];

		accountsFirebase.$loaded(function(accounts){
			/*
			accounts.forEach(function(account){
				if(myAccount.firebaseKey = account.key()){
					debugger;
				}
			});
*/
		});
		return result.promise;
	};

	this.saveAccount = function(account){
		var ref = accountsFirebase.$getRecord(account.firebaseKey);
		ref.speudo = account.speudo;
		storageProvider.update(account);
		accountsFirebase.$save(ref);
	};
}]);