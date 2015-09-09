'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:ProjectscostctrlCtrl
 * @description
 * # ProjectscostctrlCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('ProjectscostCtrl', [
		'$rootScope',
		'$scope',
		'$q',
		'$modal',
		'CostsummaryService',
		'PrinterService',
		function ($rootScope, $scope, $q, $modal, CostsummaryService, PrinterService) {
			$scope.editSummary = false;

			$scope.costsummaryService = CostsummaryService;
			$scope.costsummaryService.transactions = CostsummaryService.transactions;

			$scope.$on('update_costsummary', function(event, reset) {
				console.log('update_costsummary triggered ', reset);
				if(reset) {
					$rootScope.$broadcast('reset');
					$scope.editSummary = false;
					$scope.dirtyTransactions = [];
					$scope.dirtyOfficeExpense = null;
				}
				$scope.newTransactionParams = {
					claim : {
						transaction_type 	: 0,
						name 				: '',
						amount 				: ''
					},
					receive : {
						transaction_type 	: 1,
						name 				: '',
						amount 				: ''
					},
					materialExpense : {
						transaction_type 	: 2,
						name 				: '',
						amount 				: ''
					},
					laborCost : {
						transaction_type 	: 3,
						name 				: '',
						amount 				: ''
					},
					others : {
						transaction_type 	: 9,
						name 				: '',
						amount 				: ''
					}
				};
				$scope.costsummaryService.getSummary($scope.selectedProject.id, $scope.session.user);
			});

			$scope.newTransactionParams = {
				claim : {
					transaction_type 	: 0,
					name 				: '',
					amount 				: ''
				},
				receive : {
					transaction_type 	: 1,
					name 				: '',
					amount 				: ''
				},
				materialExpense : {
					transaction_type 	: 2,
					name 				: '',
					amount 				: ''
				},
				laborCost : {
					transaction_type 	: 3,
					name 				: '',
					amount 				: ''
				},
				others : {
					transaction_type 	: 9,
					name 				: '',
					amount 				: ''
				}
			};

			$scope.dirtyTransactions = [];
			$scope.dirtyOfficeExpense = null;

			$scope.newTransaction = function(type) {
				console.log('In newTransaction : ', type);

				var params = {};

				switch(type) {
					case 0:
						params = $scope.newTransactionParams.claim;
						break;
					case 1:
						params = $scope.newTransactionParams.receive;
						break;
					case 2:
						params = $scope.newTransactionParams.materialExpense;
						break;
					case 3:
						params = $scope.newTransactionParams.laborCost;
						break;
					case 9:
						params = $scope.newTransactionParams.others;
						break;
					default:
						params = $scope.newTransactionParams.others;
						break;
				}

				$scope.costsummaryService.createSummaryEntry(params, $scope.selectedProject.id, $scope.session.user).then(function(response) {
					console.log('add transaction done', response);
					if(response.result === 'success') {
						$rootScope.$broadcast('update_costsummary');
						return;
					}
					else {
						switch(response.status) {
							case 422:
								console.error('422: ', response.data);
								$scope.launchErrorModal(response.data);
								break;
							case 401:
								$rootScope.$broadcast('not_authenticated');
								break;
						}
					}
				});
			};

			$scope.recordDirtyOfficeExpense = function(amount) {
				console.log("in recordDirtyOfficeExpense : ", amount);
				$scope.dirtyOfficeExpense = {
					id 				: $scope.selectedProject.id,
					office_expense 	: amount/100
				};
			};

			$scope.recordDirtyTransaction = function(id, name, amount) {
				console.log("in recordDirtyTransaction : ", id, name, amount);
				
				var transactionExists = false;

				$scope.dirtyTransactions.map(function(transaction) {
					if(transaction.id === id) {
						transaction.name 	= name;
						transaction.amount 	= amount;
						transactionExists 	= true;
					}
				});

				if(!transactionExists) {
					var dirtyTransaction = {
						id 		: id,
						name 	: name,
						amount 	: amount
					};

					$scope.dirtyTransactions.push(dirtyTransaction);
				}
			};

			$scope.saveTransactionUpdates = function() {
				console.log("In saveTransactionUpdates");
				var updateCallArray = [];

				if($scope.dirtyOfficeExpense !==  null) {
					console.log('Updating office expense');
					$scope.projectsService.updateProject($scope.dirtyOfficeExpense, $scope.session.user);
				}

				if($scope.dirtyTransactions.length === 0) {
					$scope.editSummary = false;
					return;
				}

				angular.forEach($scope.dirtyTransactions, function(key, value) {
					console.log('forEach : ', key, value);
					updateCallArray.push($scope.costsummaryService.updateSummaryEntry(key, $scope.session.user));
				});

				$q.all(
					updateCallArray
				).then(function(responses) {
					$scope.editSummary = false;
					$rootScope.$broadcast('update_costsummary', true);
				}, function() {
					$scope.editSummary = false;
					$scope.launchErrorModal(['Error in saving records.', 'Please try again.']);
					$rootScope.$broadcast('update_costsummary', true);
				});
			};

			$scope.deleteSummaryEntry = function(id) {
				var modalInstance = $modal.open({
					templateUrl   : 'views/modal/deleteconfirmation.html',
					controller    : 'DeleteconfirmationCtrl',
					backdrop      : 'static',
					backdropClass : 'backdrop-oas',
					size          : 'sm',
					windowClass   : 'modal-oas vertical-center deleteconfirmation-modal',
					resolve 		: {
						modalInfo: function() {
							return {
								type: 'transaction'
							};
						}
					}
				});

				modalInstance.result.then(function(confirm) {
					if(confirm) {
						console.log('Deleting transaction : ', id);
						$scope.costsummaryService.deleteSummaryEntry(id, $scope.session.user).then(function(response) {
							console.log('delete transaction done', response);
							if(response.result === 'success') {
								$rootScope.$broadcast('update_costsummary', true);
								return;
							}
							else {
								switch(response.status) {
									case 422:
										console.error('422: ', response.data);
										$scope.launchErrorModal(response.data);
										break;
									case 401:
										$rootScope.$broadcast('not_authenticated');
										break;
								}
							}
						});
					}
					return;
				});
			};

			$scope.printSummary = function() {
				var tempScope = {};
				tempScope.selectedProject = $scope.selectedProject;
				tempScope.transactions = $scope.costsummaryService.transactions;
				PrinterService.print('views/costsummaryprinttemplate.html', tempScope);
			};
  		}
  	])
	.directive('projectProjectscost', function() {
		return {
  			templateUrl: 'views/projectscost.html'
		};
	});
