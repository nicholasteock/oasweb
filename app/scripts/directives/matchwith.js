'use strict';

/**
 * @ngdoc directive
 * @name oasApp.directive:matchwith
 * @description
 * # matchwith
 */
angular.module('oasApp')
  .directive('matchwith', function () {
    return {
      require : 'ngModel',
      scope   : {
        otherValue : '=matchwith'
      },
      link    : function(scope, element, attributes, ngModel) {
        ngModel.$validators.matchwith = function(modelValue) {
          return modelValue == scope.otherValue.$viewValue;
        };

        scope.$watch(scope.otherValue, function() {
          ngModel.$validate();
        });
      }
    };
  });
