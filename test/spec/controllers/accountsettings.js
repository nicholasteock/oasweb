'use strict';

describe('Controller: AccountsettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AccountsettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountsettingsCtrl = $controller('AccountsettingsCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
  // });
});
