'use strict';

describe('Directive: matchwith', function () {

  // load the directive's module
  beforeEach(module('oasApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  // it('should make hidden element visible', inject(function ($compile) {
  //   element = angular.element('<match></match>');
  //   element = $compile(element)(scope);
  //   expect(element.text()).toBe('this is the matchwith directive');
  // }));
});
