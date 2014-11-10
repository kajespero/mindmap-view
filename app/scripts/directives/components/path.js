'use strict';

var CLASS_SVG_CONTAINER = '.js-svg-container',
		SNAP_SVG, SNAP_FIRST_GROUP;

angular.module('mindmapModule').directive('ngPathComponent', ['$compile', '$interpolate', function($compile, $interpolate){

	return {
		restrict: 'AE',
  	replace:true,
  	templateNamespace : 'path',
  	scope:{
  		source: '@source',
  		target: '@target'
  	},
  	require : '^mindMapSvg',
  	link: {
  		pre: function preLink($scope, $element, attrs, mindMapSvgCrtl){
  			SNAP_SVG = SNAP_SVG || Snap(document.querySelector(CLASS_SVG_CONTAINER));
        SNAP_FIRST_GROUP = SNAP_FIRST_GROUP || SNAP_SVG.select('g:first-child');
  			var sPath = SNAP_SVG.path(mindMapSvgCrtl.getPathPosition($scope.source, $scope.target)).attr({
          data: JSON.stringify({'sourceId':"{{source}}",'targetId':"{{target}}"})
  			}).addClass('mindmap-path');
        SNAP_FIRST_GROUP.append(sPath);
  			$compile(sPath.node)($scope);
  		}
  	}
	}
}]);