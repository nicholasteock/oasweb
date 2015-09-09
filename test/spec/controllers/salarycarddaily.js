'use strict';

describe('Controller: SalarycarddailyCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var SalarycarddailyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalarycarddailyCtrl = $controller('SalarycarddailyCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
