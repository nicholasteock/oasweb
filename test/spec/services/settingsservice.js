'use strict';

describe('Service: settingsservice', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var settingsservice;
  beforeEach(inject(function (_settingsservice_) {
    settingsservice = _settingsservice_;
  }));

  it('should do something', function () {
    expect(!!settingsservice).toBe(true);
  });

});
