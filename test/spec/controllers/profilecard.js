'use strict';

describe('Controller: ProfilecardCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var ProfilecardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfilecardCtrl = $controller('ProfilecardCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
