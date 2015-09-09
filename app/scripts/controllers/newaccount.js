'use strict';

/**
 * @ngdoc function
 * @name oasApp.controller:NewaccountCtrl
 * @description
 * # NewaccountCtrl
 * Controller of the oasApp
 */
angular.module('oasApp')
	.controller('NewaccountCtrl', ['$rootScope', '$scope', '$timeout', 'AccountsService', function ($rootScope, $scope, $timeout, AccountsService) {

		$scope.newAccount = {
			email 					: undefined,
			name 					: undefined,
			password 				: undefined,
			password_confirmation 	: undefined,
			position 				: undefined,
			avatar 					: undefined,
			roles 					: []
		};

		$scope.newAccountRoleFlags = {
			employee_profile 	: false,
			employee_attendance : false,
			salary 				: false,
			allocation 			: false,
			labor_cost 			: false,
			material_cost 		: false,
			project_cost 		: false
		};

		$scope.$on('clear_newaccount', function() {
			$scope.newAccount = {
				email 					: undefined,
				name 					: undefined,
				password 				: undefined,
				password_confirmation 	: undefined,
				position 				: undefined,
				avatar 					: undefined,
				roles 					: []
			};

			$scope.newAccountRoleFlags = {
				employee_profile 	: false,
				employee_attendance : false,
				salary 				: false,
				allocation 			: false,
				labor_cost 			: false,
				material_cost 		: false,
				project_cost 		: false
			};
		});

		$scope.addAccount = function() {
			console.log('Adding new account : ', $scope.newAccount);
			console.log('New account role flags : ', $scope.newAccountRoleFlags);

			var hasRoles = false;

			angular.forEach($scope.newAccountRoleFlags, function(value,key) {
				if(value) {
					$scope.newAccount.roles.push(key);
					hasRoles = true;
				}
			});

			var params = {};
			params.formDetails = $scope.newAccount;
			params.file = $scope.selectedFile;

			// Add account first.
			// If there are roles, we separately add them in another callback
			// This is a hack due to inability to pass array in $upload call.
			AccountsService.addAccount(params, $scope.session.user).then(function(response) {
				console.log('add account done', response);
				if(response.result === 'success') {
					if(hasRoles) {
						AccountsService.changeRoles(response.data.id, $scope.newAccount.roles, $scope.session.user).then(function(response) {
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
	.directive('newAccount', function() {
		return {
			templateUrl: 'views/newaccountcard.html'
		};
	});
