'use strict';

describe('Service: materialsservice', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var materialsservice;
  beforeEach(inject(function (_materialsservice_) {
    materialsservice = _materialsservice_;
  }));

  it('should do something', function () {
    expect(!!materialsservice).toBe(true);
  });

});
