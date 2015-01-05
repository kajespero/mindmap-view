'use strict';

angular.module('mindmapModule').factory('KeyboardUtils', function(){
	var keyboardKeys = {
		enter: 'enter',
		tab: 'tab',
		shift: 'shift',
		esc: 'esc'		
	}

	return {
		keys:keyboardKeys,
   	9: keyboardKeys.tab,
 		13: keyboardKeys.enter,
  	16: keyboardKeys.shift,
  	27: keyboardKeys.esc
  }
});