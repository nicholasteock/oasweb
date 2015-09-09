'use strict';

describe('Controller: LaborcostctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('oasApp'));

  var LaborcostctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LaborcostctrlCtrl = $controller('LaborcostctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
