'use strict';

/**
 * @ngdoc service
 * @name oasApp.printer
 * @description
 * # printer
 * Factory in the oasApp.
 */
angular.module('oasApp')
	.factory('PrinterService', ['$rootScope', '$compile', '$http', '$timeout','$q', function ($rootScope, $compile, $http, $timeout, $q) {
		var printHtml = function (html) {
				var deferred = $q.defer();
				var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];
				hiddenFrame.contentWindow.printAndRemove = function() {
						setTimeout(function() {
							hiddenFrame.contentWindow.print();
							$(hiddenFrame).remove();
						}, 6000);
				};
				var htmlContent = "<!doctype html>"+
										"<html>"+
												'<head>'+
													'<link rel="stylesheet" href="styles/main.css">'+
    												'<link rel="stylesheet" href="styles/modules.css">'+
    											'</head>'+
												'<body style="background-color: #FFF;" onload="printAndRemove();">' +
														html +
												'</body>'+
										"</html>";
				var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
				doc.write(htmlContent);
				deferred.resolve();
				doc.close();
				return deferred.promise;
		};

		var openNewWindow = function (html) {
				var newWindow = window.open("printtemplate.html");
				newWindow.addEventListener('load', function(){ 
						$(newWindow.document.body).html(html);
				}, false);
		};

		var print = function (templateUrl, data) {
			console.log('In print : ', templateUrl, data);
				$http.get(templateUrl).success(function(template){
						var printScope = $rootScope.$new();
						angular.extend(printScope, data);
						var element = $compile($('<div>' + template + '</div>'))(printScope);

						var waitForRenderAndPrint = function() {
								if(printScope.$$phase || $http.pendingRequests.length) {
									$timeout(waitForRenderAndPrint);
								} else {
									// Replace printHtml with openNewWindow for debugging
									$timeout(function() {
										printHtml(element.html());
										printScope.$destroy();
									});
								}
						};

						waitForRenderAndPrint();
				});
		};

		var printFromScope = function (templateUrl, scope) {
				$rootScope.isBeingPrinted = true;
				$http.get(templateUrl).success(function(template){
						var printScope = scope;
						var element = $compile($('<div>' + template + '</div>'))(printScope);
						var waitForRenderAndPrint = function() {
								if (printScope.$$phase || $http.pendingRequests.length) {
										$timeout(waitForRenderAndPrint);
								} else {
									 printHtml(element.html()).then(function() {
											 $rootScope.isBeingPrinted = false;
									 });

								}
						};
						waitForRenderAndPrint();
				});
		};

		return {
				print: print,
				printFromScope:printFromScope
		};
	}]);