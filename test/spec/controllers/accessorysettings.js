'use strict';

describe('Controller: AccessorysettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AccessorysettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccessorysettingsCtrl = $controller('AccessorysettingsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
