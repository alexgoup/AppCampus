// public/js/app.js
var myapp = angular.module('appCampus', ['ngRoute', 'BuildingCtrl','EditCtrl', 'MainService','appRoutes'])

/*            .directive('hcChart', function () {
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        options: '='
                    },
                    link: function (scope, element) {
                        Highcharts.chart(element[0], scope.options);
                    }
                };
            });*/