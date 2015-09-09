'use strict';

describe('Controller: AttendancesummarymodalCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AttendancesummarymodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendancesummarymodalCtrl = $controller('AttendancesummarymodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
