'use strict';

describe('Controller: MaterialcostitemCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var MaterialcostitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialcostitemCtrl = $controller('MaterialcostitemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
