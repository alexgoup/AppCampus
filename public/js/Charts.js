myapp.directive('hcChart',function() { 
                return {
                    restrict: 'E',
                    template: '<div></div>',
                    scope: {
                        options: '='
                    },
                    link: function (scope, element) { 
                        var chart = new Highcharts.Chart(element[0], scope.options);
                        scope.$watch("options", function (newValue) { 
                            chart = Highcharts.chart(element[0], newValue);
                        },true);
                    }
};

})
