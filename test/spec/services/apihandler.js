'use strict';

describe('Service: apihandler', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var apihandler;
  beforeEach(inject(function (_apihandler_) {
    apihandler = _apihandler_;
  }));

  it('should do something', function () {
    expect(!!apihandler).toBe(true);
  });

});
