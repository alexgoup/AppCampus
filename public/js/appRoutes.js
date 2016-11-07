// public/js/appRoutes.js
    angular.module('appRoutes', []).config(['$routeProvider', function($routeProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/viewmode.html',
            controller: 'MainController'
        })

        .when('/viewmode', {
            templateUrl: 'views/viewmode.html',
           controller: 'MainController'
        })

        .when('/editmode', {
            templateUrl: 'views/editmode.html',
           controller: 'MainController'
        });


}]);