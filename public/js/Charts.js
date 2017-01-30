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
                            scope.$parent.chart = chart;
                        },true); 
                        scope.$parent.zoomState.plot = "right"
                        element.dblclick(function() { 

                          if(scope.$parent.zoomState.plot == "right") { 

                              element.animate(
                              {
                              "left": "25%", 
                               "top":"40%", 
                               "width":"50%", 
                               "height":"50%", 
                               "background-color": "rgba(60,60,60,0.7)"
                              },
                              {
                                duration:300,
                                step: function() {
                                    chart.reflow()
                                },
                                queue:false
                             }
                              );

                              scope.$parent.zoomState.plot = "centered";
                            }
                            else if (scope.$parent.zoomState.plot == "centered"){
                               element.animate(
                              {
                              "left": "74%", 
                               "top":"35%", 
                               "width":"25%", 
                               "height":"25%", 
                               "background-color": "rgba(60,60,60,0.2)"
                              },
                              {
                                duration:300,
                                step: function() {
                                    chart.reflow()
                                }
                             }
                              );
                              scope.$parent.zoomState.plot = "right";                                
                            }

                        });

                                    $(document).click(function(event) { 
                              if(!$(event.target).closest(element).length) {
                                  if(element.is(":visible")) {
                                     element.animate(
                                    {
                                    "left": "74%", 
                                     "top":"35%", 
                                     "width":"25%", 
                                     "height":"25%", 
                                     "background-color": "rgba(60,60,60,0.2)"
                                    },
                                    {
                                      duration:300,
                                      step: function() {
                                          chart.reflow()
                                      }
                                   }
                                    );
                                    scope.$parent.zoomState.plot = "right";                  
                                  }
                              }        
                          })
                    }
};

})
