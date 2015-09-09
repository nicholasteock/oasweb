'use strict';

describe('Controller: MaterialcostsummarymodalCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var MaterialcostsummarymodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialcostsummarymodalCtrl = $controller('MaterialcostsummarymodalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
