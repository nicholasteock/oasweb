'use strict';

describe('Filter: nullzero', function () {

  // load the filter's module
  beforeEach(module('oasApp'));

  // initialize a new instance of the filter before each test
  var nullzero;
  beforeEach(inject(function ($filter) {
    nullzero = $filter('nullzero');
  }));

  it('should return the input prefixed with "nullzero filter:"', function () {
    var text = 'angularjs';
    expect(nullzero(text)).toBe('nullzero filter: ' + text);
  });

});
