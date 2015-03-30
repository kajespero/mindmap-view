'use strict';

angular.module('mindmapModule').factory('Node', ['Utils',function(utils){
	function Position(data){
		if (data){
			this.x = data.x;
			this.y = data.y;
			this.width = data.width;
			this.height = data.height;
		} else {
			this.x = undefined;
			this.y = undefined;
			this.width = undefined;
			this.height = undefined;
		}
	}

	function Node(data){
		if(data){
			this.id = data.id;
			this.value = data.value;
			this.children = data.children;
			this.position = new Position(data.position);
			this.parentId = data.parentId;
		} else {
			this.id = utils.uuid();
			this.value = undefined;
			this.children = [];
			this.position = new Position();
			this.parentId = undefined;
		}
		
	}

	Node.prototype = {
		getId: function(){
			return this.id;
		},

		getValue: function(){
			return this.value;
		},
		getChildren: function(){
			return this.children;
		},
		getPosition: function(){
			return this.position;
		},
		setPosition: function(position){
			this.position = new Position(position);
		}
	};
	return Node;
}]);