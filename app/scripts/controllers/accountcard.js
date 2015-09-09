'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:AccountcardCtrl
 * @description
 * # AccountcardCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('AccountcardCtrl', ['$rootScope', '$scope', '$timeout', 'AccountsService', function ($rootScope, $scope, $timeout, AccountsService) {

		$scope.editAccount = false;

		$scope.accountRoleFlags = {
			employee_profile 	: false,
			employee_attendance : false,
			salary 				: false,
			allocation 			: false,
			labor_cost 			: false,
			material_cost 		: false,
			project_cost 		: false
		};

		angular.forEach($scope.account.roles, function(role) {
			$scope.accountRoleFlags[role] = true;
		});

		$scope.updateAccount = function(account) {
			$scope.account.roles = [];

			var hasRoles = false;

			angular.forEach($scope.accountRoleFlags, function(value,key) {
				console.log(value, key);

				if(value) {
					$scope.account.roles.push(key);
					hasRoles = true;
				}
			});

			var params = {};
			params.formDetails = $scope.account;
			params.file = $scope.selectedImage;

			AccountsService.updateAccount(params, $scope.session.user).then(function(response) {
				console.log('update account done', response);
				$scope.editAccount = false;
				if(response.result === 'success') {
					if(hasRoles) {
						AccountsService.changeRoles(response.data.id, $scope.account.roles, $scope.session.user).then(function(response) {
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
					else {
						$rootScope.$broadcast('update_accountsettings', true);
						return;
					}
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

		// IMAGE UPLOAD STUFF
		//********************************************************************/
		$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
		$scope.selectedImage = [];
		$scope.avatarThumb = null;

		$scope.onImageSelect = function ($files) {
			$scope.selectedImage = $files;
		};

		$scope.$watch('files', function(files) {
			$scope.formUpload = false;
			if (files != null) {
				for (var i = 0; i < files.length; i++) {
					$scope.errorMsg = null;
					(function(file) {
						$scope.generateThumb(file);
					})(files[i]);
				}
			}
		});

		$scope.generateThumb = function(file) {
			if (file != null) {
				if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
					$timeout(function() {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(file);
						fileReader.onload = function(e) {
							$timeout(function() {
								$scope.avatarThumb = e.target.result;
							});
						};
					});
				}
			}
		};
	}])
	.directive('accountCard', function() {
		return {
			templateUrl: 'views/accountcard.html'
		};
	});
