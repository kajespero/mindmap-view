'use strict';

var XMLNS_URL = 'http://www.w3.org/2000/svg',
    CLASS_CONTAINER = '.js-mindmap-container',
    CLASS_SVG_CONTAINER = '.js-svg-container',
    CONTAINER = document.querySelector(CLASS_CONTAINER),
    SNAP_SVG, SNAP_FIRST_GROUP;

var _createSVGNode = function($interpolate, $scope){
  var snapRect = SNAP_SVG.rect().addClass('mindmap-rectangle'),
      snapText = SNAP_SVG.text().addClass('mindmap-text'),
      snapGroup = SNAP_SVG.group(snapRect, snapText); 

  snapRect.attr({
    x: "{{node.position.x}}",
    y: "{{node.position.y}}",
    width: "{{node.position.width}}",
    height: "{{node.position.height}}",
    ry:3,
    rx:3
   });
   
   snapText.attr({
    x: "{{node.position.x + 10}}",
    y: "{{node.position.y + node.position.height/2+ 3}}",
    text: "{{node.value}}"
   });
  return snapGroup;
}

var _createNodePopUp = function(rect){
   var popup = angular.element('<ng-pop-up-input node-value="node.value" save="save()" autofocus/>'),
      bbox = rect.getBBox(),
      dragBBox = SNAP_FIRST_GROUP.getBBox(),
      nearestViewportElement = rect.node.nearestViewportElement;

      popup.css({
        top : dragBBox.y + bbox.y + nearestViewportElement.offsetTop + (dragBBox.y === 35 ? 35 : 0) +'px',
        left : dragBBox.x + bbox.x + nearestViewportElement.offsetLeft + (dragBBox.x === 10 ? 10 : 0) +'px',
        width : 300 + 'px',
        height : 25 + 'px',
        position : 'absolute'
      });
    return popup;
}



angular.module('mindmapModule').directive('ngRectangleComponent', ['$compile', '$interpolate',  'KeyboardUtils', function($compile, $interpolate, KeyboardUtils){

  var _manageKeyEvent = function(event, callback){
    if(KeyboardUtils[event.which] === 'tab'){
      callback.call();
    }
  }

	return {
      restrict: 'AE',
      replace:true,
      templateNamespace : 'g',
      scope: {
      	node: '=mindMapNode'
      },
      require : '^mindMapSvg',
      link: {
        pre: function preLink($scope, $element, attrs, mindMapSvgCrtl) {

          $scope.save = function(){
            mindMapSvgCrtl.saveMindMap();
          }

          CONTAINER = document.querySelector(CLASS_CONTAINER);
          SNAP_SVG = Snap(document.querySelector(CLASS_SVG_CONTAINER));
          SNAP_FIRST_GROUP = SNAP_SVG.select('g:first-child');
          var group = _createSVGNode($interpolate, $scope);

          group.mouseover(function(event){
            $scope.isSelectedNode = true; 
          });

          group.mouseout(function(event){
             $scope.isSelectedNode = false; 
          });

          group.dblclick(function(event){
             angular.element(CONTAINER).append($compile(_createNodePopUp(this[0]))($scope));
          });

          angular.element(document.querySelector('body')).on('keydown', function(event){
            if($scope.isSelectedNode){
              _manageKeyEvent(event, function(){
                $scope.isSelectedNode = false; 
                mindMapSvgCrtl.createNewChild($scope.node)
              });
            }
          });
          SNAP_FIRST_GROUP.append(group);
          $compile(group.node)($scope);
        },
        post: function postLink($scope, $element) {
          $element.append($compile('<ng-rectangle-component mind-map-node="child" ng-repeat="child in node.children"/>')($scope));
          $element.append($compile('<ng-path-component source="{{node.id}}" target="{{child.id}}" ng-repeat="child in node.children"/>')($scope));
        }
      }
    };
}]);