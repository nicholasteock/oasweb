'use strict';

describe('Controller: AccessorycostitemCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AccessorycostitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccessorycostitemCtrl = $controller('AccessorycostitemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
