angular.module("app").controller("spinnerController", ['$scope', 'spinnerService', function($scope, spinnerService) {
    $scope.spinner = spinnerService.object;
}])