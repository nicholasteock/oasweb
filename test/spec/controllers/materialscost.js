'use strict';

describe('Controller: MaterialscostctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var MaterialscostctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaterialscostctrlCtrl = $controller('MaterialscostctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
