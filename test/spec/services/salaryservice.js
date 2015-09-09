'use strict';

describe('Service: salaryservice', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var salaryservice;
  beforeEach(inject(function (_salaryservice_) {
    salaryservice = _salaryservice_;
  }));

  it('should do something', function () {
    expect(!!salaryservice).toBe(true);
  });

});
