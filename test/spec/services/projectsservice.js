'use strict';

describe('Service: ProjectsService', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var ProjectsService;
  beforeEach(inject(function (_ProjectsService_) {
    ProjectsService = _ProjectsService_;
  }));

  it('should do something', function () {
    expect(!!ProjectsService).toBe(true);
  });

});
