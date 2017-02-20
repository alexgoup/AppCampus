// public/js/appRoutes.js
/*    angular.module('appRoutes', []).config(['$routeProvider', function($routeProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/viewmode.html',
            controller: 'BuildingController'
        })

        .when('/viewmode', {
            templateUrl: 'views/viewmode.html',
           controller: 'BuildingController'
        })

        .when('/editmode', {
            templateUrl: 'views/editmode.html',
           controller: 'EditController'
        });


}]);*/

    var appRoutes = angular.module('appRoutes', ['ui.router']);

    appRoutes.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/viewmode');

    $stateProvider


        .state('view', {
            url: '/viewmode',
            templateUrl: 'views/viewmode.html',
            controller: 'BuildingController'
        }) 


        .state('edit', {
            url: '/editmode',
            templateUrl: 'views/editmode.html',
            controller: 'EditController'
        })


});