'use strict';


angular.module('mindmapModule').controller('MindmapCtrl', ['$scope', '$compile', 'MindmapService', function($scope, $compile, mindmapService){

	var _loadMindMaps = function(){
		mindmapService.getAllMindMap().then(function(mindmaps){
			$scope.mindmaps = mindmaps;
		});
	};

	$scope.createMindMap = function($event, mindmapName){
		console.log('create here a new mindmap ' );
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

		
		var templateMindMap = angular.element('<mind-map-svg attr-mind-map="rootId"/>'),
			linkMindMapFn = $compile(templateMindMap),
			elementMindMap = linkMindMapFn($scope);
			
		if(svgContainer){
			angular.element(svgContainer).replaceWith(elementMindMap);
		} else{
			angular.element(jsController).append(elementMindMap);
		}
	};

	_loadMindMaps();
}]);