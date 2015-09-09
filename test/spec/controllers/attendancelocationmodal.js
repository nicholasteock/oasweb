'use strict';

describe('Controller: AttendancelocationmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AttendancelocationmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendancelocationmodalCtrl = $controller('AttendancelocationmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
