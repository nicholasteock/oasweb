'use strict';

/**
 * @ngdoc service
 * @name oasApp.accountsService
 * @description
 * # accountsService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('AccountsService', [
		'$http',
		'$upload',
		'AuthService',
		'ApiHandlerService',
		function ($http, $upload, AuthService, ApiHandlerService) {
			var urlPrefix = ApiHandlerService.getUrlPrefix();

			var accountsService = {};

			accountsService.accounts = [];

			accountsService.getAccounts = function(params, user) {
				console.log('In accountsService.getAccounts', params);
				
				if(user === undefined) {AuthService.retrieveSession();}

				ApiHandlerService.triggerLoading();

				return $http({
					method  : 'GET',
					url     : urlPrefix + 'users/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					params  : params
				})
				.then( function(res) {
					console.log('getAccounts response : ', res);
					if(params.page > 1) {
						var temp = accountsService.accounts.concat(res.data.users);
						angular.copy(temp, accountsService.accounts);
					}
					else {
						angular.copy(res.data.users, accountsService.accounts);
					}
					ApiHandlerService.triggerLoaded();
					return res.data.num_pages;
				});
			};

			accountsService.addAccount = function(newAccount, user) {
				var request = {},
					response = {};

				console.log('In accountsService.addAccount', newAccount);

				ApiHandlerService.triggerLoading();

				request = {
					method  : 'POST',
					url     : urlPrefix + 'users/',
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : newAccount.formDetails
				};

				if(newAccount.file && newAccount.file.length !== 0) {
					request.file = newAccount.file[0];
					request.fileFormDataName = 'avatar';
				}

				return $upload.upload(request)
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			accountsService.updatePersonalAccount = function(account, user) {
				console.log('In accountsService.updatePersonalAccount', account);

				if(user === undefined) {
					AuthService.retrieveSession();
				}

				ApiHandlerService.triggerLoading();

				var request 	= {},
					response 	= {};

				request = {
					method  : 'PUT',
					url     : urlPrefix + 'users/' + account.formDetails.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : JSON.parse(angular.toJson(account.formDetails))
				};

				if(account.file.length !== 0) {
					request.file = account.file[0];
					request.fileFormDataName = 'avatar';
				}

				return $upload.upload(request)
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			accountsService.updateAccount = function(account, user) {
				console.log('In accountsService.updateAccount', account);

				if(user === undefined) {
					AuthService.retrieveSession();
				}

				ApiHandlerService.triggerLoading();

				var request 	= {},
					response 	= {};

				request = {
					method  : 'PUT',
					url     : urlPrefix + 'users/' + account.formDetails.id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : JSON.parse(angular.toJson(account.formDetails))
				};

				if(account.file.length !== 0) {
					request.file = account.file[0];
					request.fileFormDataName = 'avatar';
				}

				return $upload.upload(request)
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			accountsService.changeRoles = function(id, roles, user) {
				console.log('In accountsService.changeRoles', id, roles);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'PUT',
					url     : urlPrefix + 'users/' + id,
					headers : {
						'X-USER-ID'   : user.id,
						'X-USER-TOKEN': user.authToken
					},
					data  : {roles: roles}
				})
				.then(
					ApiHandlerService.successResponse,
					ApiHandlerService.errorResponse
				);
			};

			accountsService.deleteAccount = function(id, user) {
				console.log('In accountsService.deleteAccount', id);
				ApiHandlerService.triggerLoading();
				return $http({
					method  : 'DELETE',
					url     : urlPrefix + 'users/' + id,
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

			return accountsService;
		}
	]);
