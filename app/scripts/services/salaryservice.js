'use strict';

/**
 * @ngdoc service
 * @name oasApp.SalaryService
 * @description
 * # salaryService
 * Factory in the oasApp.
 */
angular.module('oasApp')
.factory('SalaryService', [
	'$http',
	'AuthService',
	'ApiHandlerService',
	function ($http, AuthService, ApiHandlerService) {
		var urlPrefix = ApiHandlerService.getUrlPrefix();

		var salaryService = {};

		var formatMonthlySalary = function(page, data) {
			data.employees.map(function(employee) {
				employee.selectedForPrinting = false;
			});

			if(page > 1) {
				var temp = salaryService.salary.monthly.concat(data.employees);
				angular.copy(temp, salaryService.salary.monthly);
			}
			else {
				angular.copy(data.employees, salaryService.salary.monthly);
			}
			ApiHandlerService.triggerLoaded();
		};

		salaryService.salary = {daily: [], monthly: []};

		salaryService.getDailySalary = function(params, user) {
			console.log('In salaryService.getDailySalary', params);

			if(user === undefined) {AuthService.retrieveSession();}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'GET',
				url     : urlPrefix + 'daily_salaries/',
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : params
			})
			.then( function(res) {
				if(params.page > 1) {
					var temp = salaryService.salary.daily.concat(res.data.employees);
					angular.copy(temp, salaryService.salary.daily);
				}
				else {	
					angular.copy(res.data.employees, salaryService.salary.daily);
				}
				ApiHandlerService.triggerLoaded();
				return res.data.num_pages;
			});
		};

		salaryService.createDailyCost = function(costParams, employeeId, user) {
			console.log('In salaryService.createDailyCost');

			if(user === undefined) {
				AuthService.retrieveSession();
			}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'POST',
				url     : urlPrefix + 'employees/' + employeeId + '/daily_costs',
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : costParams
			})
			.then(
				ApiHandlerService.successResponse,
				ApiHandlerService.errorResponse
			);
		};

		salaryService.updateDailyCost = function(costParams, costId, user) {
			console.log('In salaryService.updateDailyCost');

			if(user === undefined) {
				AuthService.retrieveSession();
			}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'PUT',
				url     : urlPrefix + 'daily_costs/' + costId,
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : costParams
			})
			.then(
				ApiHandlerService.successResponse,
				ApiHandlerService.errorResponse
			);
		};

		salaryService.getMonthlySalary = function(params, user) {
			console.log('In salaryService.getMonthlySalary', params);

			if(user === undefined) {AuthService.retrieveSession();}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'GET',
				url     : urlPrefix + 'monthly_salaries/',
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : params
			})
			.then( function(res) {
				formatMonthlySalary(params.page, res.data);
				return res.data.num_pages;
			});
		};

		salaryService.getAllMonthlySalary = function(params, user) {
			console.log('In salaryService.getAllMonthlySalary ', params);

			if(user === undefined) {AuthService.retrieveSession();}

			ApiHandlerService.triggerLoading();

			return $http({
				method  : 'GET',
				url     : urlPrefix + 'monthly_salaries/',
				headers : {
					'X-USER-ID'   : user.id,
					'X-USER-TOKEN': user.authToken
				},
				params  : params
			})
			.then( function(res) {
				ApiHandlerService.triggerLoaded();
				return res.data.employees;
			});
		};

		return salaryService;
	}]);
