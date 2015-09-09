'use strict';

describe('Controller: MaterialsettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var MaterialsettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialsettingsCtrl = $controller('MaterialsettingsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
