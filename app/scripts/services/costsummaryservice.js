'use strict';

/**
 * @ngdoc service
 * @name oasApp.costsummary
 * @description
 * # costsummary
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('CostsummaryService', [
		'$http',
		'AuthService',
		'ApiHandlerService',
		function ($http, AuthService, ApiHandlerService) {
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var formatCostsummary = function(data) {
				var totalClaimed = 0,
					totalReceived = 0,
					totalMaterialExpense = data.material_expense,
					totalLaborCost = data.labor_cost,
					totalOthersExpense = 0,
					totalExpenses = 0,
					balanceClaimReceived = 0,
					projectGainLoss = 0,
					balanceGainLoss = 0;

				data.amount_claimed.map(function(claim) {
					totalClaimed += Number(claim.amount);
				});

				data.amount_received.map(function(received) {
					totalReceived += Number(received.amount);
				});

				data.other_material_expenses.map(function(expense) {
					totalMaterialExpense += expense.amount;
				});

				data.other_labor_costs.map(function(laborcost) {
					totalLaborCost += laborcost.amount;
				});

				data.others.map(function(otherExpense) {
					totalOthersExpense += otherExpense.amount;
				});

				balanceClaimReceived = totalClaimed - totalReceived;
				totalExpenses = totalMaterialExpense + totalLaborCost + totalOthersExpense;
				projectGainLoss = totalReceived - totalExpenses;

				data.total_claimed 			= totalClaimed;
				data.total_received 		= totalReceived;
				data.total_material_expense = totalMaterialExpense;
				data.total_labor_cost 		= totalLaborCost;
				data.total_others_expense 	= totalOthersExpense;
				data.balance_claimed_received = balanceClaimReceived;
				data.total_expenses 		= totalExpenses;
				data.project_gain_loss 		= projectGainLoss;
				data.balance_gain_loss 		= balanceGainLoss;

				angular.copy(data, costsummaryService.transactions);
				ApiHandlerService.triggerLoaded();
			};

			var costsummaryService = {};

			costsummaryService.transactions = {};

			costsummaryService.getSummary = function(params, user) {
				console.log('In costsummaryService.getSummary : ', params);
			
				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'projects/' + params + '/transactions',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					console.log('getSummary response : ', res);
					formatCostsummary(res.data);
				});
			};

			costsummaryService.createSummaryEntry = function(params, projectId, user) {
				console.log('In costsummaryService.createSummaryEntry : ', params);
			
				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'POST',
					url     : urlPrefix + 'projects/' + projectId + '/transactions',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			costsummaryService.updateSummaryEntry = function(params, user) {
				console.log('In costsummaryService.updateSummaryEntry : ', params);

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'transactions/' + params.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : params
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			costsummaryService.deleteSummaryEntry = function(id, user) {
				console.log('In costsummaryService.deleteSummaryEntry : ', id);
			
				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'transactions/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			return costsummaryService;
		}
	]);
