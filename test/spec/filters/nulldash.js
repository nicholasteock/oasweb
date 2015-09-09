'use strict';

describe('Filter: nulldash', function () {

  // load the filter's module
  beforeEach(module('oasApp'));

  // initialize a new instance of the filter before each test
  var nulldash;
  beforeEach(inject(function ($filter) {
    nulldash = $filter('nulldash');
  }));

  it('should return the input prefixed with "nulldash filter:"', function () {
    var text = 'angularjs';
    expect(nulldash(text)).toBe('nulldash filter: ' + text);
  });

});
