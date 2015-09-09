'use strict';

describe('Controller: ProfilesCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var ProfilesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProfilesCtrl = $controller('ProfilesCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
    // expect(scope.awesomeThings.length).toBe(3);
  // });
});
