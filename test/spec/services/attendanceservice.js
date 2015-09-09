'use strict';

describe('Service: attendanceservice', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var attendanceservice;
  beforeEach(inject(function (_attendanceservice_) {
    attendanceservice = _attendanceservice_;
  }));

  it('should do something', function () {
    expect(!!attendanceservice).toBe(true);
  });

});
