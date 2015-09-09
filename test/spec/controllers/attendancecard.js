'use strict';

describe('Controller: AttendancecardCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AttendancecardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendancecardCtrl = $controller('AttendancecardCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
