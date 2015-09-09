'use strict';

/**
 * @ngdoc service
 * @name oasApp.AUTHEVENTS
 * @description
 * # AUTHEVENTS
 * Constant in the oasApp.
 */
angular.module('oasApp')
	.constant('AUTH_EVENTS', {
		loginSuccess 	: 'auth-login-success',
		loginFailed 	: 'auth-login-failed',
		logoutSuccess 	: 'auth-logout-success',
		sessionTimeout 	: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized 	: 'auth-not-authorized'
	});
