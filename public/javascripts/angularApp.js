var app = angular.module('appCampus', ['ui.router']);

app.controller('MainCtrl', [
'$scope',
	function($scope){
		$scope.campus_str = 'Campus'; // AngularJS two way data-binding
		$scope.building_str = 'Building';
		$scope.buildings = [
		  {name: "CRC", cost: 15000000}, 
		  {name: "Clough Commons", cost: 30000000},
		  {name: "Bobby Dodd Stadium", cost: 20000000},
		];

	}
]
);

/*app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/home');

	  $stateProvider
	    .state('home', {
	      url: '/home',
	      templateUrl: '/home.html',
	      controller: 'MainCtrl'
	    })

	    .state('about', {
	      url: '/about',
	      templateUrl: '/about.html'
	    });

	  
}]);
*/