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

var jsonToLoad = ['/api/buildingsnames','/api/zones','/api/buildingspos'];
var njson = jsonToLoad.length;
var nLoadJsonFinished = 0;
var buildingsnamesJSON,
	zonesList, 
	buildingsposJSON; 

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