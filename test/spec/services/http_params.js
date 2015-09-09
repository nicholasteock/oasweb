'use strict';

describe('Service: HTTPPARAMS', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var HTTPPARAMS;
  beforeEach(inject(function (_HTTPPARAMS_) {
    HTTPPARAMS = _HTTPPARAMS_;
  }));

  it('should do something', function () {
    expect(!!HTTPPARAMS).toBe(true);
  });

});
