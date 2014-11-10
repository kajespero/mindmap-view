'use strict';

angular.module('mindmapModule').directive('ngPopUpInput', function($compile){
	return {
	  restrict: 'AE',
      replace: true,
      scope: {
      	text: '=nodeValue',
        save : '&'
      },
      templateUrl: '/templates/components/pop-up-input.html',
      link: function($scope, $element) {
        $element.bind('blur', function() {
       		$element.unbind('blur');
       		$element.remove();
          $scope.save();
        });
      }
	}
});