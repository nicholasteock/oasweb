'use strict';

/**
 * @ngdoc directive
 * @name oasApp.directive:AlphabetList
 * @description
 * # AlphabetList
 */
angular.module('oasApp')
	.directive('alphabetList', ['$rootScope', function($rootScope) {
		return {
			templateUrl: 'views/alphabetlist.html',
			restrict: 'E',
			scope: {},
			link: function(scope, element, attrs) {
				scope.alphabetArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
				scope.activeChar = '';
				scope.changeActiveChar = function(alphabet) {
					if(alphabet === scope.activeChar) return;
					scope.activeChar = alphabet;
					$rootScope.$broadcast(attrs.page+'_alphabet_changed', scope.activeChar);
				};
				scope.$on('alphabetlist_reset', function() {scope.activeChar = '';});
			}
		};
	}]);
