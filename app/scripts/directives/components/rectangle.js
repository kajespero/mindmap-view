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
  snapGroup.attr('node-id', "{{node.id}}");
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
   var popup = angular.element('<ng-pop-up-input node-value="node.value" save="save()"/>'),
      bbox = rect.getBBox(),
      dragBBox = SNAP_FIRST_GROUP.getBBox(),
      nearestViewportElement = rect.node.nearestViewportElement;

      popup.css({
        top : dragBBox.y + bbox.y + nearestViewportElement.offsetTop+'px',
        left : dragBBox.x + bbox.x + nearestViewportElement.offsetLeft  +'px',
        width : 300 + 'px',
        height : 25 + 'px',
        position : 'absolute'
      });
    return popup;
}

angular.module('mindmapModule').directive('ngRectangleComponent', ['$compile', '$interpolate', '$timeout',  'KeyboardUtils', 
    function($compile, $interpolate, $timeout,KeyboardUtils){

  var _manageKeyEvent = function(event, callback){
    callback.call();
  }

	return {
      restrict: 'AE',
      replace:true,
      templateNamespace : 'g',
      scope: {
      	node: '=mindMapNode',
        lastBorn: '@lastBorn'
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
            var allElementSelected = SNAP_SVG.selectAll('.active');
            allElementSelected.forEach(function(selectedElmnt){
              selectedElmnt.removeClass('active');
            })
            mindMapSvgCrtl.setSelectedNodeId($scope.node.id);  
            group[0].addClass('active');
            group[1].addClass('active');   
          });

          group.mouseout(function(event){
            mindMapSvgCrtl.setSelectedNodeId();
            group[0].removeClass('active');
            group[1].removeClass('active');
          });

          group.dblclick(function(event){
             angular.element(CONTAINER).append($compile(_createNodePopUp(this[0]))($scope));
          });

          angular.element(document.querySelector('body')).on('keydown', function(event){
            if($scope.node.id === mindMapSvgCrtl.getSelectedNodeId()){
              if(event.target.tagName.toLowerCase() !== 'input'){
                _manageKeyEvent(event, function(){
                  group[0].removeClass('active');
                  group[1].removeClass('active');
                  var createdUUID;
                  if(KeyboardUtils[event.which] === KeyboardUtils.keys.tab){
                    createdUUID = mindMapSvgCrtl.createNewChild($scope.node);
                  } else if(KeyboardUtils[event.which] === KeyboardUtils.keys.enter){
                    createdUUID = mindMapSvgCrtl.createNewBrother($scope.node.parentId);
                  }
                   mindMapSvgCrtl.setSelectedNodeId(createdUUID);              
                });
              } 
            }
          });
          SNAP_FIRST_GROUP.append(group);
          $compile(group.node)($scope);
          $timeout(function () {
            if($scope.$parent.$last){
              if($scope.node){
                  if($scope.node.id === mindMapSvgCrtl.getLastBornId()){

                    group[0].addClass('active');
                    group[1].addClass('active');
                    angular.element(CONTAINER).append($compile(_createNodePopUp(group[0]))($scope));
                    mindMapSvgCrtl.setSelectedNodeId($scope.node.id);
                  }
                }
              }
          });
        },
        post: function postLink($scope, $element, attrs, mindMapSvgCrtl) {
          $element.append($compile('<ng-rectangle-component node-id={{child.id}} mind-map-node="child" ng-repeat="child in node.children"/>')($scope));
          $element.append($compile('<ng-path-component source="{{node.id}}" target="{{child.id}}" ng-repeat="child in node.children"/>')($scope));
        }
      },
    };
}]);