var app = angular
    .module("app", [
        'ui.bootstrap', 'ngRoute', 'ngAnimate', 'ui.grid', 'angular-growl', 'angularSpinner',
    ]);
app.config(['$routeProvider',
        function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'components/login-view/login-template.html',
                controller: 'loginController'
            }).
            when('/details', {
                templateUrl: 'components/details-view/details-template.html',
                controller: 'detailsController'
            }).
            otherwise({
                templateUrl: 'components/login-view/login-template.html',
                controller: 'loginController'
            })
    }]);
app.config(['growlProvider', function (growlProvider) {
        growlProvider.globalTimeToLive(5000);
        growlProvider.globalDisableCountDown(true);
        growlProvider.globalDisableIcons(true);

    }]);
