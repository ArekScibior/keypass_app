
var app = angular.module('app');
app.directive('spinner', function () {
	return {
		restrict: 'EA',
		scope: {
			show: '=?', //referencje, oczekuje obiektu, "?"" jest opcjonalny (ignorowanie błedu kompilacji)
		},
		template: [
			'<div ng-cloak ng-show="show" class="spinner-main">',
				'<div class="spinner">',
				'  <span us-spinner></span>',
				'</div>',
				'<div class="please-wait">Proszę czekać...</div>',
			'<div/>'
		].join(''),
		controller: ["$scope", "spinnerService", function ($scope, spinnerService) {
			var obj = {
				show: function () {
					$scope.show = true;
				},
				hide: function () {
					$scope.show = false;
				}
			};
			$scope.imgSrc = 'http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif'
			spinnerService._register(obj);
		}]
	};
});