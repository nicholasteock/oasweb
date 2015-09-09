'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AccountsettingsCtrl
 * @description
 * # AccountsettingsCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AccountsettingsCtrl', ['$rootScope', '$scope', '$modal', 'AccountsService', function ($rootScope, $scope, $modal, AccountsService) {
		var toggleAccountsInfiniteScroll = function(pageLimit) {
			if(pageLimit === $scope.accountParams.page) {
				console.log('accounts limit reached');
				$scope.enableInfiniteScroll = false;
			}
			else {
				$scope.enableInfiniteScroll = true;
			}
		};

		$scope.enableInfiniteScroll = false;
		$scope.editNewAccount = false;

		$scope.accountParams = {
			page: 1
		};

		$scope.accountsService = AccountsService;
		$scope.accountsService.accounts = AccountsService.accounts;

		$scope.$on('tab_changed', function() {
			// $('.table-container').scrollTop(0);
			$scope.enableInfiniteScroll = false;
		});

		$scope.$on('update_accountsettings', function(event, reset) {
			console.log('update_accountsettings triggered', reset);
			if(reset) {
				// $rootScope.$broadcast('reset');
				$scope.enableInfiniteScroll = false;
				$scope.editNewAccount = false;
				$scope.accountParams = {
					page 			: 1
				};
				$rootScope.$broadcast('clear_newaccount');
			}
			$scope.accountsService.getAccounts($scope.accountParams, $scope.session.user).then(toggleAccountsInfiniteScroll);
		});

		$scope.nextPage = function() {
			if(!$scope.enableInfiniteScroll) {
				return;
			}
			console.log('account settings nextPage');
			$scope.accountParams.page += 1;
			$scope.accountsService.getAccounts($scope.accountParams, $scope.session.user).then(toggleAccountsInfiniteScroll);
		};

		$scope.toggleNewAccount = function() {
			$scope.editNewAccount = !$scope.editNewAccount;
			$rootScope.$broadcast('clear_newaccount');
		};

		$scope.deleteAccount = function(id) {
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
							type: 'account'
						};
					}
				}
			});

			modalInstance.result.then(function(confirm) {
				if (confirm) {
					console.log('Deleting account : ', id);
					$scope.accountsService.deleteAccount(id, $scope.session.user).then(function(response) {
						console.log('delete account done', response);
						if(response.result === 'success') {
							$rootScope.$broadcast('update_accountsettings', true);
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
	}])
	.directive('settingsAccounts', function() {
		return {
			templateUrl: 'views/accountsettings.html'
		};
	});
