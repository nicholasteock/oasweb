'use strict';

describe('Controller: ProjectscostctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var ProjectscostctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectscostctrlCtrl = $controller('ProjectscostctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
