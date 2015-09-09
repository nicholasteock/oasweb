'use strict';

describe('Service: bingmaps', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var bingmaps;
  beforeEach(inject(function (_bingmaps_) {
    bingmaps = _bingmaps_;
  }));

  it('should do something', function () {
    expect(!!bingmaps).toBe(true);
  });

});
