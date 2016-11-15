var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

var jsonToLoad = ['/api/buildingsnames','/api/zones','/api/buildingspos','/api/buildingsparams','/api/buildingsparamsbis','/api/buildingsfloors'];
var njson = jsonToLoad.length;
var nLoadJsonFinished = 0;
var buildingsnamesJSON,
	zonesList, 
	buildingsposJSON,
	buildingsparamsJSON,
	buildingsfloorsJSON; 

function getMonthly(building){ 
	buildingClient = new HttpClient();
	buildingClient.get('/api/buildingsmonthly/' + building.id.toString(), function(response) {
	    buildingmonthlyJSON = JSON && JSON.parse(response) || $.parseJSON(response);
		var obj = buildingmonthlyJSON["0"]; 
		building.environment.scope.$apply(function(){ 
			building.environment.scope.chartOptions.series = [{
	            name: '2012',
	            data: [null,null,null,null,null,null,null,null,null, obj["Oct-12"], obj["Nov-12"], obj["Dec-12"]]
	        }, {
	            name: '2013',
	            data: [obj["Jan-13"],obj["Feb-13"],obj["Mar-13"],obj["Apr-13"],obj["May-13"],obj["Jun-13"],obj["Jul-13"],obj["Aug-13"],obj["Sep-13"],obj["Oct-13"],obj["Nov-13"],obj["Dec-13"]]
	        }, {
	            name: '2014',
	            data: [obj["Jan-14"],obj["Feb-14"],obj["Mar-14"],obj["Apr-14"],obj["May-14"],obj["Jun-14"],obj["Jul-14"],obj["Aug-14"],obj["Sep-14"],obj["Oct-14"],obj["Nov-14"],obj["Dec-14"]]
	        }, {
	            name: '2015',
	            data: [obj["Jan-15"],obj["Feb-15"],obj["Mar-15"],obj["Apr-15"],obj["May-15"],obj["Jun-15"],obj["Jul-15"],obj["Aug-15"],obj["Sep-15"],obj["Oct-15"],obj["Nov-15"],obj["Dec-15"]]
	        }];
        building.environment.scope.chartOptions.title.text = building.name + " Energy Consumption";
    });

	});
	
}

function initBuildings(environment) { 
	bClient = new HttpClient();
	bClient.get('/api/buildingsnames', function(response) {
	   buildingsnamesJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   nLoadJsonFinished ++; 
	   if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }

	});

	cClient = new HttpClient();
	cClient.get('/api/zones', function(response) {
	   zonesList = JSON && JSON.parse(response) || $.parseJSON(response);
	   nLoadJsonFinished ++;
	   if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	aClient = new HttpClient();
	aClient.get('/api/buildingspos', function(response) {
    	buildingsposJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	dClient = new HttpClient();
	dClient.get('/api/buildingsparams', function(response) {
    	buildingsparamsJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	fClient = new HttpClient();
	fClient.get('/api/buildingsparamsbis', function(response) {
    	buildingsparamsbisJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});

	eClient = new HttpClient();
	eClient.get('/api/buildingsfloors', function(response) {
    	buildingsfloorsJSON = JSON && JSON.parse(response) || $.parseJSON(response);
	   	nLoadJsonFinished ++;
	   	if (njson == nLoadJsonFinished){
	   	environment.initBuildingsList(); 
	   }
	});





}
/*
function initBuildingsMeshes(environment){

	aClient = new HttpClient();
	aClient.get('/api/buildingspos', function(response) {
    	var buildingsposJSON = JSON && JSON.parse(response) || $.parseJSON(response);
   		for(var j=0; j<buildingsposJSON.length; j++){
   			var mesh = buildingsposJSON[j]; 
   			var meshObj = new MeshBuilding(mesh.bId,mesh.zoneId,mesh.type,mesh.x0,mesh.y0,mesh.p1,mesh.p2,mesh.p3,mesh.p4,mesh.p5);
   			for(var k=0; k<initBuildingsList.length; k++){
   				var bldgObj = initBuildingsList[k];
   				if(bldgObj.id == meshObj.buildingID){
   					bldgObj.meshList.push(meshObj);
   					break;
   				}
   			}

   		}
	   
   		environment.currentBlist = initBuildingsList; 
   		console.log(environment);
	});
}*/