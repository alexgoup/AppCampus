// public/js/services/MainService.js
angular.module('MainService', []).factory('BuildingFactory', ['$http', function($http) {

    return {
        // call to get all nerds
        getBuildingsPos : function() {
            return $http.get('/api/buildingspos');
        },
        getBuildingsNames : function() {
            return $http.get('/api/buildingsnames');
        },
        getZones : function() { 
            return $http.get('/api/zones');
        }


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new nerd
/*        create : function(nerdData) {
            return $http.post('/api/buildings', nerdData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/buildings/' + id);
        }*/
    }       

}]);