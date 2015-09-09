'use strict';

describe('Service: allocationservice', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var allocationservice;
  beforeEach(inject(function (_allocationservice_) {
    allocationservice = _allocationservice_;
  }));

  it('should do something', function () {
    expect(!!allocationservice).toBe(true);
  });

});
