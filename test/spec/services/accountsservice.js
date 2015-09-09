'use strict';

describe('Service: accountsservice', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var accountsservice;
  beforeEach(inject(function (_accountsservice_) {
    accountsservice = _accountsservice_;
  }));

  it('should do something', function () {
    expect(!!accountsservice).toBe(true);
  });

});
