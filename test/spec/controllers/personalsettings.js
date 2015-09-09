'use strict';

describe('Controller: PersonalsettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var PersonalsettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonalsettingsCtrl = $controller('PersonalsettingsCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
  // });
});
