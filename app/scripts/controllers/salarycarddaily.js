'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:SalarycarddailyCtrl
 * @description
 * # SalarycarddailyCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('SalarycarddailyCtrl',['$rootScope', '$scope', '$q', function ($rootScope, $scope, $q) {
		var costTypes = {
			'project_allowance' 	: 0,
			'extra_money' 			: 1,
			'external_work' 		: 2,
			'mc' 					: 3,
			'hp' 					: 4,
			'safety' 				: 5,
			'transport_allowance'	: 6,
			'additional' 			: 7
		};

		var processDailyCost = function(costType) {
			console.log('Processing costType : ', costType);

			var costObject;
			var costParams = {
				date: $scope.dailyParams.date,
				cost_type: costTypes[costType]
			};

			if($scope.employee[costType]) {
				costObject = $scope.employee[costType];
				costParams.cost = costObject.cost;
		
				if(costObject.id) { // Update cost record
					console.log('Update cost : ', costType, costParams);
					return $scope.salaryService.updateDailyCost(costParams, costObject.id, $scope.session.user);
				}
				else { // Create new cost record
					console.log('Create cost : ', costType, costParams);
					return $scope.salaryService.createDailyCost(costParams, $scope.employee.id, $scope.session.user);
				}
			}
		};

		$scope.save = function(employee) {
			console.log('SAVING SALARY : ', employee);

			$q.all([
				processDailyCost('project_allowance'),
				processDailyCost('extra_money'),
				processDailyCost('external_work'),
				processDailyCost('mc'),
				processDailyCost('hp'),
				processDailyCost('safety'),
				processDailyCost('transport_allowance'),
				processDailyCost('additional')
			])
			.then(function(data){
				// console.log(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
				$scope.editMode = false;
				// $rootScope.$broadcast('update_salary');
			}, function() {
				$scope.launchErrorModal(['Error in saving records.', 'Please try again.']);
				// $rootScope.$broadcast('update_salary');
			});
		};
	}])
	.directive('salaryCardDaily', function() {
		return {
			templateUrl: 'views/salarycarddaily.html'
		};
	});
