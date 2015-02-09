'use strict';

angular.module('mindmapModule').factory('KeyboardUtils', function(){
	var keyboardKeys = {
		enter: 'enter',
		tab: 'tab',
		shift: 'shift',
		esc: 'esc',
		down: 'down',
		up: 'up',
		left: 'left',
		right: 'right'		
	}

	return {
		keys:keyboardKeys,
   	9: keyboardKeys.tab,
 		13: keyboardKeys.enter,
  	16: keyboardKeys.shift,
  	27: keyboardKeys.esc,
  	// keyboard navigation
  	37: keyboardKeys.left,
  	38: keyboardKeys.up,
  	39: keyboardKeys.right,
  	40:keyboardKeys.down
  }
});