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


}

Building.prototype = {
    
    animate: function(){
          var _this = this;
          if(_this.firstTimeAnimate){
                 _this.environment.scene.registerAfterRender(function () { 
                if(_this.animateState == 1) { 
                    if(!_this.environment.scope.heatmapBool && !_this.environment.scope.energyheatmapBool){
                        _this.mesh.material = _this.environment.brightermaterialBuilding; 
                    }
                    _this.mesh.rotation.y += 2*Math.PI/750; 
                    if(_this.mesh.position.y < 50 ){
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
                    if(!_this.environment.scope.heatmapBool && !_this.environment.scope.energyheatmapBool){
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
    }
}