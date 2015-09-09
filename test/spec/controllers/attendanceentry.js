'use strict';

describe('Controller: AttendanceentryCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AttendanceentryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendanceentryCtrl = $controller('AttendanceentryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
