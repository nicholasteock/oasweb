'use strict';

describe('Controller: ManpowerCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var ManpowerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManpowerCtrl = $controller('ManpowerCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {

  // });
});
