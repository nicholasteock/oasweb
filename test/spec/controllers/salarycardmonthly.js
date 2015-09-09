'use strict';

describe('Controller: SalarycardmonthlyCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var SalarycardmonthlyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalarycardmonthlyCtrl = $controller('SalarycardmonthlyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
