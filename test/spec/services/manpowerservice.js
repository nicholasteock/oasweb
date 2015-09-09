'use strict';

describe('Service: ManpowerService', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var ManpowerService;
  beforeEach(inject(function (_ManpowerService_) {
    ManpowerService = _ManpowerService_;
  }));

  it('should do something', function () {
    expect(!!ManpowerService).toBe(true);
  });

});
