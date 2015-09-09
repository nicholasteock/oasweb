'use strict';

/**
 * @ngdoc service
 * @name oasApp.BingMapsService
 * @description
 * # BingMapsService
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('BingMapsService', ['$http', function ($http) {

		var baseUrl 		= 'http://dev.virtualearth.net/REST/v1/Imagery/Map/Road?';
		var bingKey 		= 'AkpMfMQZehVe_Q6Huq9R_mW3NV-17qlBZturl2ysWAgxZKclRFiUZGm1fgy9FJNl';
		var zoomLevel 		= 15;
		var latLng 			= '';
		var mapSize 		= '600,300';

		var bingMapsService = {};

		bingMapsService.getMap = function(latitude, longitude) {
			return 	baseUrl+
					'key='+bingKey+
					'&centerPoint='+latitude+','+longitude+
					'&pp='+latitude+','+longitude+';65'+
					'&mapSize='+mapSize+
					'&zoomLevel='+zoomLevel;
		};
		
		return bingMapsService;
	}]);
