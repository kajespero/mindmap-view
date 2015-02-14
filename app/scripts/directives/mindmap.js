'use strict';


var CLASS_SVG_CONTAINER = '.js-svg-container',
    SNAP_SVG, 
    TREE_STRUCTURE,
    MINDMAP_CTRL;

 var _calculRootPosition = function(svgElmt){
    return {
      x: 10,
      y: svgElmt[0] && svgElmt[0].clientHeight ? svgElmt[0].clientHeight/2 : 150,
      height: 25,
      width: 250
    };
};

var _createTreeStructure = function(node, parent, previousNodeId){
  var nodeStructure = {
    node:node,
    position: node.position,
    parent: parent || node,
    nextNodeId: null,
    previousNodeId: previousNodeId,
    leaf:true
  };

  if(!TREE_STRUCTURE){
    TREE_STRUCTURE = {};
    TREE_STRUCTURE.links = [];
  }
  if(node){
     TREE_STRUCTURE[node.id] = {
        structure: nodeStructure,
        children: []
      };
    // get parent structure
    if(parent){
      var parentStructure = TREE_STRUCTURE[parent.id];
      if(parentStructure){
        if(_.indexOf(parentStructure.children,node.id) === -1){
          parentStructure.children.push(node.id);
          parentStructure.structure.leaf = false; 
        }
      }
      var previousStructure = previousNodeId && TREE_STRUCTURE[previousNodeId] ? TREE_STRUCTURE[previousNodeId] : null;
      if(previousStructure){
        TREE_STRUCTURE[previousNodeId].structure.nextNodeId = node.id;
      }
    }

    var countLeaf = _.countBy(TREE_STRUCTURE, function(item){
      return item.structure && item.structure.leaf;
    });

    // update y position for node
    nodeStructure.position.y = countLeaf.true * 35;

    // run it for all children 
    node.children.forEach(function(child, index){
      _createTreeStructure(child, node, node.id);
    });
  }
};

var _walkThruTree = function(){
  _.map(TREE_STRUCTURE, function(item){
    if(item.children && item.children.length > 0){
      var iPosition = item.structure.position;
      item.children.forEach(function(childId){
        var childStructure = TREE_STRUCTURE[childId],
            cPosition = childStructure.structure.position;
        cPosition.x = cPosition.x || iPosition.x + iPosition.width + 100;
        cPosition.width = cPosition.width || 250;
        cPosition.height = cPosition.height || 25;
      });
    }
  });

  var allParent = _.filter(TREE_STRUCTURE, function(item){
    return item.children && item.children.length > 0;
  });

  var sumYPosition, 
      avgYPosition,
      cStructure;
  allParent.forEach(function(parent){
    sumYPosition = 0;
    parent.children.forEach(function(childId){
      cStructure = TREE_STRUCTURE[childId].structure;
      if(cStructure){
        sumYPosition = sumYPosition + cStructure.position.y;
      }
    });
    avgYPosition = sumYPosition / parent.children.length;

    parent.structure.position.y = avgYPosition;
  });
};

var _findLastDescendant = function(parent){
  var pStructure = TREE_STRUCTURE[parent],
      descendantId;
  if(pStructure){
    if(pStructure && pStructure.children.length > 0){
      descendantId = pStructure.children[pStructure.children.length-1];
    }
    if(descendantId && TREE_STRUCTURE[descendantId].children.length > 0){
      return _findLastDescendant(descendantId);
    }
  }
  return descendantId;
};

var _calculateNewChildPosition = function(newBorn){
  return TREE_STRUCTURE[newBorn.id].structure.position;
};

var _calculatePathPosition = function(sourceId, targetId){
  var sourcePosition = TREE_STRUCTURE[sourceId] ? TREE_STRUCTURE[sourceId].structure.position : null,
      targetPosition = TREE_STRUCTURE[targetId] ? TREE_STRUCTURE[targetId].structure.position : null,
      sourceX = sourcePosition ? sourcePosition.x + sourcePosition.width : 0, 
      sourceY = sourcePosition ? sourcePosition.y + (sourcePosition.height / 2) : 0,
      targetX = targetPosition ? targetPosition.x : 0, 
      targetY = targetPosition ? targetPosition.y + (targetPosition.height / 2) : 0;

  var data = 'M'+ sourceX + ',' + sourceY +
        'C' + (sourceX + 100) + ' ' + sourceY + ' ' + (targetX - 100) +
        ' ' + (targetY) + ' ' + targetX + ' ' + targetY +
        'M' + targetX + ',' + targetY +
        'L' +(targetX - 10) + ',' + (targetY - 5) +
        'M' + targetX + ',' + targetY +
        'L' + (targetX - 10) + ',' + (targetY + 5);

  return data;
};

var _updatePathPosition = function(){
  var allPath = SNAP_SVG.selectAll('path'),
      data;

  _.each(allPath,function(path){
      data = JSON.parse(path.attr('data'));
      path.attr({
        d: _calculatePathPosition(data.sourceId, data.targetId)
      });
    });
};


var _getElement = function(nodeId){
  return SNAP_SVG.select('g[node-id="'+nodeId+'"]');
}

angular.module('mindmapModule').directive('mindMapSvg', ['$compile','MindmapService', 'KeyboardUtils', function($compile, mindmapService, KeyboardUtils){

  var _createChild = function(parent){
    var newBornNode = mindmapService.create(parent.id);
    return newBornNode; 
  };

  var _navigateThruTree = function(originId, type){
    var originStructure = TREE_STRUCTURE[originId],
        nodeParent = originStructure.structure.parent,
        node = originStructure.structure.node,
        indexOf = nodeParent.children.indexOf(originStructure.structure.node);

    if(type === KeyboardUtils.keys.up){
      if(indexOf > 0){
        return nodeParent.children[indexOf-1] ? nodeParent.children[indexOf-1].id : nodeParent.id;
      } else {
        return node.parentId;
      }
    } else if(type === KeyboardUtils.keys.down){
      if(indexOf < nodeParent.children.length){
        return nodeParent.children[indexOf+1] ? nodeParent.children[indexOf+1].id : nodeParent.id;
      } else {
        return node.parentId;
      }
    } else if(type === KeyboardUtils.keys.left){
      return node.parentId ? node.parentId: node.id;
    } else if (type === KeyboardUtils.keys.right){
      return node.children.length > 0 ? node.children[0].id : node.id;
    }
  };


  function MindMapController($scope){
        this.createNewChild = function(parent){
          var newBorn = _createChild(parent);
          parent.children.push(newBorn);
          TREE_STRUCTURE = null;
          _createTreeStructure($scope.root);
          _walkThruTree();
          newBorn.position = _calculateNewChildPosition(newBorn);
          _updatePathPosition();
          $scope.lastBorn = newBorn.id;
          $scope.$digest();
          return newBorn.id;
        };

        this.getLastBornId = function(){
          return $scope.lastBorn;
        };

        this.createNewBrother = function(parentId){
          if(parentId){
            return this.createNewChild(TREE_STRUCTURE[parentId].structure.node);
          }
        };

        this.navigateThruMap = function(origin, type){
          return _navigateThruTree(origin.id, type);
        }

        this.saveMindMap = function(){
          mindmapService.saveMindMap($scope.mindmap);
        };
        this.getTreeStructure = function(){
          return TREE_STRUCTURE;
        };
        this.getPathPosition = function(sourceId, targetId){
          return _calculatePathPosition(sourceId, targetId);
        };

        this.setSelectedNodeId = function(selectedNodeId){
          $scope.selectedNodeId = selectedNodeId;
          $scope.$digest();
        };
        this.getSelectedNodeId = function(){
          return  $scope.selectedNodeId || $scope.root.id;
        }
        return this;
  }

	var directive =  {
      restrict: 'AE',
      replace: true,
      templateNamespace : 'svg',
      scope: {
      	 mindmapid: '=attrMindMap'
      },
      templateUrl: '/templates/template-mindmap.html',
      controller : function($scope, $element){
        var resolvedNode = mindmapService.getMindMap($scope.mindmapid);
        resolvedNode.then(function(mindmap){
          $scope.mindmap = mindmap;
          $scope.root = mindmap.root;
          $scope.root.position = _calculRootPosition($element.find('svg'));
          _createTreeStructure($scope.root);
          _walkThruTree();
        });

        this.setSelectedNodeId = function(selectedNodeId){
          MINDMAP_CTRL.setSelectedNodeId(selectedNodeId);
        };

        this.getLastBornId = function(){
          return MINDMAP_CTRL.getLastBornId();
        };

        this.saveMindMap = function(){
          mindmapService.saveMindMap($scope.mindmap);
        };

        this.getPathPosition = function(sourceId, targetId){
          return _calculatePathPosition(sourceId, targetId);
        };
      },
      link: function($scope, $element){
        SNAP_SVG = Snap(document.querySelector(CLASS_SVG_CONTAINER));
        SNAP_SVG.select('g').drag();

        $scope.$watch('selectedNodeId', function(newValue, oldValue) {
            if(newValue !== oldValue){
              var newSelectedGroup = _getElement(newValue),
                  oldSelectdGroup = oldValue ? _getElement(oldValue) : _getElement($scope.root.id);

              if(oldSelectdGroup){
                oldSelectdGroup[0].removeClass('active');
                oldSelectdGroup[1].removeClass('active');
              }
             
              if(newSelectedGroup){
                newSelectedGroup[0].addClass('active');
                newSelectedGroup[1].addClass('active');    
              }
              
            }
        });

        angular.element(document.querySelector('body')).on('keydown', function(event){
           if(event.target.tagName.toLowerCase() !== 'input'){
              var selectedNode = TREE_STRUCTURE[MINDMAP_CTRL.getSelectedNodeId()].structure.node;
              if(KeyboardUtils[event.which] === KeyboardUtils.keys.tab){
                 event.preventDefault();
                MINDMAP_CTRL.setSelectedNodeId(MINDMAP_CTRL.createNewChild(selectedNode));
              } else if(KeyboardUtils[event.which] === KeyboardUtils.keys.enter){
                 event.preventDefault();
                MINDMAP_CTRL.setSelectedNodeId(MINDMAP_CTRL.createNewBrother(selectedNode.parentId));
              } else if (event.which > 36 && event.which < 41){
                 event.preventDefault();
                MINDMAP_CTRL.setSelectedNodeId(MINDMAP_CTRL.navigateThruMap(selectedNode, KeyboardUtils[event.which]));
              }     
            } 
          });
        MINDMAP_CTRL = MINDMAP_CTRL || new MindMapController($scope);
      }
      
    };

    return directive;
}]);