'use strict';

describe('Service: USERROLES', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var USERROLES;
  beforeEach(inject(function (_USERROLES_) {
    USERROLES = _USERROLES_;
  }));

  it('should do something', function () {
    expect(!!USERROLES).toBe(true);
  });

});
