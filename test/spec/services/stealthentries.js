'use strict';

describe('Service: stealthentries', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var stealthentries;
  beforeEach(inject(function (_stealthentries_) {
    stealthentries = _stealthentries_;
  }));

  it('should do something', function () {
    expect(!!stealthentries).toBe(true);
  });

});
