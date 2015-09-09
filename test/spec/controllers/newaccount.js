'use strict';

describe('Controller: NewaccountCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var NewaccountCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewaccountCtrl = $controller('NewaccountCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
