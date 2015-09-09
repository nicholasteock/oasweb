'use strict';

/**
 * @ngdoc overview
 * @name oasApp
 * @description
 * # oasApp
 *
 * Main module of the application.
 */
angular
	.module('oasApp', [
		'ngAnimate',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ngCookies',
		'ui.bootstrap',
		'angularFileUpload',
		'infinite-scroll',
		'highcharts-ng',
		'angular-toArrayFilter'
	])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardCtrl'
			})
			.when('/login', {
				templateUrl: 'views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/dashboard', {
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});
	})
	.run( function($rootScope, $location, $cookies, Session, USER_ROLES, AuthService) {
		$rootScope.session          = Session;
		$rootScope.session.user 	= Session.user;
		$rootScope.isAuthenticated  = AuthService.isAuthenticated;

		// if(!lastViewed) {
		// 	lastViewed = {activePanel:'manpower',activeTab:'profiles'};
		// 	localStorage.lastViewed = angular.toJson(lastViewed);
		// }

		// if(!$rootScope.session.user && !$rootScope.session.user && $rootScope.isAuthenticated()) {
		// if($cookies.authToken) {
		// 	console.log('restoring session');
		// 	setTimeout(function() {
		// 		$rootScope.session.restoreSession();
		// 	}, 1000);
		// }

		// Redirects user to login page if not logged in.
		$rootScope.$on('$locationChangeStart', function(event, next, current) {
			if( !$rootScope.isAuthenticated() && next.templateUrl !== 'views/login.html' ) {
				$rootScope.session.destroy();
				$location.path( '/login' );
			}
		});

		$rootScope.$on('not_authenticated', function() {
			alert('Please login to continue.');
			$rootScope.session.destroy();
			$location.path( '/login' );
		});
	})
	.value('THROTTLE_MILLISECONDS', 1000);
