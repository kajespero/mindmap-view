'use strict';


angular.module('mindmapModule').controller('MindmapCtrl', ['$scope', '$compile', 'MindmapService', 'FirebaseService',
	function($scope, $compile, mindmapService, firebaseService){

		var _initiateFirebase = function(){
			firebaseService.getAccount().then(function(account){
				$scope.account = account;
			});

			firebaseService.getUsers();
		};

		var _loadMindMaps = function(){
			mindmapService.getAllMindMap().then(function(mindmaps){
				$scope.mindmaps = mindmaps;
			});
		};

		$scope.updateAccount = function(){
			firebaseService.saveAccount($scope.account);
		};

		$scope.createMindMap = function($event, mindmapName){
			var mindmap = mindmapService.createMindMap(mindmapName);
			mindmapService.saveMindMap(mindmap);
			_loadMindMaps();
			$scope.selectedMindmap = mindmap.id;
			$scope.loadMindMap(mindmap.id);
		};

		$scope.loadMindMap = function(selectedMindMap){
			$scope.rootId = selectedMindMap;

			var jsController = document.querySelector('.js-controller'),
				svgContainer = document.querySelector('.js-mindmap-container');

			
			var templateMindMap = angular.element('<mind-map-svg attr-mind-map="rootId" layout="column" flex="100"/>'),
				linkMindMapFn = $compile(templateMindMap),
				elementMindMap = linkMindMapFn($scope);
				
			if(svgContainer){
				angular.element(svgContainer).replaceWith(elementMindMap);
			} else{
				angular.element(jsController).append(elementMindMap);
			}
		};

		_loadMindMaps();
		_initiateFirebase();
}]);