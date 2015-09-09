'use strict';

describe('Controller: AccountcardCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var AccountcardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountcardCtrl = $controller('AccountcardCtrl', {
      $scope: scope
    });
  }));

});
