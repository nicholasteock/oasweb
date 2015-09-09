'use strict';

describe('Controller: NewprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var NewprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewprofileCtrl = $controller('NewprofileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
