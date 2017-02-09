
function Bus(id,route,environment) {
    this.id=id;
    this.route = route; 
    this.environment = environment; 
    this.position; 
    this.mesh;
    this.road; 
    this.angle_from_previous; 
    this.angle; 
    this.allroads;



}

Bus.prototype = {
    updatePosition: function(){

    },
    getDirection: function(){
        var minDist = 100000; 
        var secondMinDist = 110000; 
        var closerPoints = [this.allroads[0], this.allroads[1]]; 
        for(var k=0; k<this.allroads.length;k++){
            var roadPoint = this.allroads[k]; 
            var dist = Math.sqrt((roadPoint.x - this.position.x)*(roadPoint.x - this.position.x) + (roadPoint.z - this.position.z)*(roadPoint.z - this.position.z));  
            if(dist < minDist){
                minDist = dist; 
                closerPoints.splice(0,1,roadPoint); 
            } 
            if (dist < secondMinDist && dist > minDist){
                secondMinDist = dist; 
                closerPoints.splice(1,1,roadPoint); 
            }
        } 
        var angle = Math.atan2(closerPoints[0].z - closerPoints[1].z, closerPoints[0].x - closerPoints[1].x); if(this.id == "434"){console.log(closerPoints); console.log( "angle : " + angle); 
        console.log(this.position);
        console.log(this.angle_from_previous);
    }
/*        if(Math.abs(angle + Math.PI - this.angle_from_previous) < Math.abs(angle - this.angle_from_previous)){ 
            angle = angle + Math.PI; 
        }*/
        /*if(minDist > 5){ this.angle = this.angle_from_previous;}
        else{ this.angle = angle;}*/
        this.angle = angle; 
    },
}