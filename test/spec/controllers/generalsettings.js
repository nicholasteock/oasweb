'use strict';

describe('Controller: GeneralsettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var GeneralsettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GeneralsettingsCtrl = $controller('GeneralsettingsCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
  // });
});
