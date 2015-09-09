'use strict';

describe('Controller: AllocationCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AllocationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllocationCtrl = $controller('AllocationCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
  // });
});
