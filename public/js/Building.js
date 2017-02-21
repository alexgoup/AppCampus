
function Building(id,name,bClass,environment) {
    this.id=id;
    this.meshList = []; 
    this.name = name; 
    this.bClass = bClass; 
    this.zone;
    this.mesh3DList = [];
    this.params;
    this.departmentList = []; 
    this.mesh; 
    this.savex;
    this.savey;
    this.savez;
    this.inity;
    this.iniroty;
    this.lastroty;
    this.environment = environment;
    this.animateState = 0;
    this.firstTimeAnimate = true; 
    this.firstTimeDesanimate = true;
   
    
    this.camera = this.environment.application.user.camera; 
    this.user = this.environment.application.user;


}

Building.prototype = {
    
    animate: function(){ console.log("here")
          var _this = this; 
          if(_this.firstTimeAnimate){
                 _this.environment.scene.registerAfterRender(function () { 
                if(_this.animateState == 1) { 
                    if(!_this.environment.scope.heatmapBool && !_this.environment.scope.energyheatmapBool && !_this.environment.scope.areaenergyheatmapBool && !_this.environment.scope.footprintheatmapBool ){
                        _this.mesh.material = _this.environment.brightermaterialBuilding; 
                    }
                    _this.mesh.rotation.y += 2*Math.PI/750; 
                    if(_this.mesh.position.y < 40 ){
                        _this.mesh.position.y +=1;
                    }
                    _this.lastroty = _this.mesh.rotation.y; 

                }

              });
             _this.firstTimeAnimate = false;
          }

          _this.environment.currentTarget = _this; 

    },

    desanimate: function(){ 
          var _this = this; 
            if(_this.firstTimeDesanimate){
                _this.environment.scene.registerAfterRender(function () { 
                if(_this.animateState == 2){
                    if(!_this.environment.scope.heatmapBool && !_this.environment.scope.energyheatmapBool && !_this.environment.scope.areaenergyheatmapBool && !_this.environment.scope.footprintheatmapBool){
                        _this.mesh.material = _this.environment.materialBuilding; 
                    }
                    if(_this.mesh.position.y > _this.inity ){ 
                        _this.mesh.position.y -=1;
                    }
                    var rem = ((_this.lastroty - _this.initroty) % (2*Math.PI)); 
                    var rotlimitmin = _this.lastroty - rem; 
                    var rotlimitplus = rotlimitmin + 2*Math.PI;
                    
                    if(_this.lastroty - rotlimitmin < rotlimitplus - _this.lastroty){
                        if(_this.mesh.rotation.y > rotlimitmin ){
                            _this.mesh.rotation.y -=2*Math.PI/750;
                        }
                    }
                    else{ 
                        if(_this.mesh.rotation.y < rotlimitplus ){
                            _this.mesh.rotation.y +=2*Math.PI/750;
                        }
                    }
 
                    if( (_this.mesh.rotation.y <= rotlimitmin || rotlimitplus <= _this.mesh.rotation.y) && _this.mesh.position.y <= _this.inity) { 
                        _this.animateState = 0;
                    } 


                }

                });
                 _this.firstTimeDesanimate = false;
            }

          _this.environment.currentTarget = ""; 
    },




    footprintModel: function(){
        var factor = 0.61420489; // in kg CO2 by kwH
        var energycopy = {};
        this.params.tot_footprint2014 = this.params.tot_energy2014*factor;
        for(var key in this.params.monthly_energy){ 
            if(key != "_id" && key != "id"){
                energycopy[key] = this.params.monthly_energy[key] * factor; // MODEL HERE
            }
            else{
                energycopy[key] = this.params.monthly_energy[key];
            }
        } 
        this.params.monthly_footprint = energycopy;
    },    

    areaenergyModel: function(){
        var energycopy = {};
        var ftsq_into_msq = 0.092903;
        for(var key in this.params.monthly_energy){ 
            if(key != "_id" && key != "id"){
                energycopy[key] = this.params.monthly_energy[key]/this.params.bGSF/ftsq_into_msq; // MODEL HERE
            }
            else{
                energycopy[key] = this.params.monthly_energy[key];
            }
        } 
        this.params.monthly_areaenergy = energycopy;
        this.params.tot_areaenergy2014 = energycopy["Jan-14"]+energycopy["Feb-14"]+energycopy["Mar-14"]+energycopy["Apr-14"]+energycopy["May-14"]+energycopy["Jun-14"]+energycopy["Jul-14"]+energycopy["Aug-14"]+energycopy["Sep-14"]+energycopy["Oct-14"]+energycopy["Nov-14"]+energycopy["Dec-14"];
    },

    energyusageModel: function(){
        this.params.energyUsage = [
            {
                name: 'HVAC',
                y: Math.floor((Math.random() * 100) + 1), 
            },
            {
                name: 'Plug Load',
                y: Math.floor((Math.random() * 100) + 1), 
            },
            {
                name: 'Lighting',
                y: Math.floor((Math.random() * 100) + 1),
            },
            {
                name: 'Water Heating',
                y: Math.floor((Math.random() * 100) + 1), 
            }
        ];

    },

    populationModel: function(){
        if(this.params != undefined && this.params.populationtot != undefined && this.totalAssignedArea != undefined && this.departmentList != undefined){
            this.params.population = []; 
            for(var i=0; i<this.departmentList.length; i++){
                var dep = this.departmentList[i]; 
                var depname = dep.name; 
                var area = dep.assignedArea; 
                var area_ratio = area/this.totalAssignedArea;
                if(depname != "TOTALS"){
                    this.params.population.push({
                        name: depname, 
                        y: Math.floor(this.params.populationtot*area_ratio)
                    })
                }


            }
        }

    },

    tiltingParams: function(){
        if(this.mesh != undefined){
            var zpos = this.mesh.position.z; 
            var a = (1.103-1.37)/(120+154);
            var b = 1.203 -a*120; 
            this.params.tiltingBeta = a*zpos + b; 
            this.params.tiltingAlpha = 4.693; 
        }
    },

    copy: function(){
        var newbldg = new Building(this.id,this.name,this.bClass,this.environment); 
         for (var attr in this) {
        if (this.hasOwnProperty(attr)) newbldg[attr] = this[attr];
    }

    return newbldg; 
    }
}