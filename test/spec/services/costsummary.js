'use strict';

describe('Service: costsummary', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var costsummary;
  beforeEach(inject(function (_costsummary_) {
    costsummary = _costsummary_;
  }));

  it('should do something', function () {
    expect(!!costsummary).toBe(true);
  });

});
