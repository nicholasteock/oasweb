'use strict';

describe('Controller: AttendancecalendarmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AttendancecalendarmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendancecalendarmodalCtrl = $controller('AttendancecalendarmodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
