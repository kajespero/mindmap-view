'use strict';

angular.module('mindmapModule').directive('ngPopUpInput', ['$compile', 'KeyboardUtils', function($compile, KeyboardUtils){
	return {
	  restrict: 'AE',
      replace: true,
      scope: {
      	text: '=nodeValue',
        save : '&'
      },
      templateUrl: '/templates/components/pop-up-input.html',
      link: function($scope, $element) {
        var oldValue = $scope.text;
        $element[0].focus();
        $element.bind('blur', function(event) {
       		$element.unbind('blur');
       		$element.remove();
          $scope.save();
        });

        $element.bind('keydown', function(event) {
          if(KeyboardUtils[event.which] === KeyboardUtils.keys.enter || KeyboardUtils[event.which] === KeyboardUtils.keys.esc){
            $element.unbind('keydown');
            $element.remove();
            $scope.save();
          }
        });
      }
	}
}]);