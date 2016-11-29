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
                        console.log($(window).height())
                        element.currentState = "right"
                        element.dblclick(function() { 

                          if(element.currentState == "right") { 

                              element.animate(
                              {
                              "left": "25%", 
                               "top":"25%", 
                               "width":"50%", 
                               "height":"50%", 
                               "background-color": "rgba(0,0,0,0.6)"
                              },
                              {
                                duration:300,
                                step: function() {
                                    chart.reflow()
                                }
                             }
                              );
                              element.currentState = "centered";
                            }
                            else if (element.currentState == "centered"){
                               element.animate(
                              {
                              "left": "74%", 
                               "top":"35%", 
                               "width":"25%", 
                               "height":"25%", 
                               "background-color": "rgba(0,0,0,0.2)"
                              },
                              {
                                duration:300,
                                step: function() {
                                    chart.reflow()
                                }
                             }
                              );
                              element.currentState = "right";                                
                            }

                        });
                    }
};

})
