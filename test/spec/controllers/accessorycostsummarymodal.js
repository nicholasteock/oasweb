'use strict';

describe('Controller: AccessorycostsummarymodalCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AccessorycostsummarymodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccessorycostsummarymodalCtrl = $controller('AccessorycostsummarymodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
