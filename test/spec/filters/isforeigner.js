'use strict';

describe('Filter: isForeigner', function () {

  // load the filter's module
  beforeEach(module('oasApp'));

  // initialize a new instance of the filter before each test
  var isForeigner;
  beforeEach(inject(function ($filter) {
    isForeigner = $filter('isForeigner');
  }));

  it('should return the input prefixed with "isForeigner filter:"', function () {
    var text = 'angularjs';
    expect(isForeigner(text)).toBe('isForeigner filter: ' + text);
  });

});
