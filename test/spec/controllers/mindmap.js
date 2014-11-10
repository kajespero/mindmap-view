'use strict';

describe('Controller: MindMap Controller', function () {

  // load the controller's module
  beforeEach(module('mindmapModule'));

  var MindmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MindmapCtrl = $controller('MindmapCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.rootId).toBe('36807009-0da3-4e7c-71d1-2d5e53ef61f5');
  });
});
