myapp.directive('descriptionpanelDirective', function(){ 
return{
    restrict: 'E', // restrict to element
    template: '<div class="panel-heading" id=buildingPanelHeading><h3 class="panel-title" id="buildingPanelTitle"> <span> {{mouseOverBuildingName}} </span> </h3> </div> <div class="panel-body" id="buildingPanelBody" > <table class="table" id="paramstable"> <tr ng-repeat="param in currentparams"> <td>{{param.name}}</td> <td>{{param.value}}</td> </tr> </table> </div>',
    link: function(scope,element){ 
        element.dblclick(function() { 

          if(scope.zoomState.description == "right") { 

              element.animate(
              {
              "left": "25%", 
               "top":"25%", 
               "width":"50%", 
               "height":"50%", 
               "background-color": "rgba(0,0,0,0.6)"
              },
              {
                duration:300
             }
              );
              if(scope.zoomState.plot == "centered"){
               element.next().animate(
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
	                    scope.chart.reflow();
	                }
	             }
	              );
                scope.zoomState.plot = "right";  
              }
              scope.zoomState.description = "centered";
            }
            else if (scope.zoomState.description == "centered"){
               element.animate(
              {
              "left": "74%", 
               "top":"5%", 
               "width":"25%", 
               "height":"25%", 
               "background-color": "rgba(0,0,0,0.2)"
              },
              {
                duration:300
             }
              );
              scope.zoomState.description = "right";                                
            }

        });
		        $(document).click(function(event) { 
		    if(!$(event.target).closest(element).length) {
		        if(element.is(":visible")) {
		               element.animate(
		              {
		              "left": "74%", 
		               "top":"5%", 
		               "width":"25%", 
		               "height":"25%", 
		               "background-color": "rgba(0,0,0,0.2)"
		              },
		              {
		                duration:300
		             }
		              );
		              scope.zoomState.description = "right";  		            
		        }
		    }        
		})
    }
}
});