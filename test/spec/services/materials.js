'use strict';

describe('Service: materials', function () {

  // load the service's module
  beforeEach(module('oasApp'));

  // instantiate service
  var materials;
  beforeEach(inject(function (_materials_) {
    materials = _materials_;
  }));

  it('should do something', function () {
    expect(!!materials).toBe(true);
  });

});
