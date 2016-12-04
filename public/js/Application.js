document.addEventListener("DOMContentLoaded", function () {
    var babylonApp = new Application('renderCanvas');
    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector(); 
    var $rootScope = injector.get('$rootScope'); 
}, false);

Application = function(canvasId) {
    // Canvas et engine défini ici
    var canvas = document.getElementById(canvasId);
    var engine = new BABYLON.Engine(canvas, true);
    this.engine = engine; 
    var _this = this;
    _this.actualTime = Date.now();
    // On initie la scène avec une fonction associée à l'objet Game
    this.scene = this._initScene(engine);

    var _user = new User(_this, canvas);

    var _environment = new Environment(_this);

    // Permet au jeu de tourner
    engine.runRenderLoop(function () {

        // Récuperet le ratio par les fps
        //_this.fps = Math.round(1000/engine.getDeltaTime());

        // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
        //_player._checkMove((_this.fps)/60);

        _this.scene.render();
               
    });

    // Ajuste la vue 3D si la fenetre est agrandie ou diminuée
    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);

};


Application.prototype = {
    // Prototype d'initialisation de la scène
    _initScene : function(engine) {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0,0,0);
        return scene;
    }
};

// ------------------------- TRANSFO DE DEGRES/RADIANS 
function degToRad(deg)
{
   return (Math.PI*deg)/180
}
// ----------------------------------------------------

// -------------------------- TRANSFO DE DEGRES/RADIANS 
function radToDeg(rad)
{
   // return (Math.PI*deg)/180
   return (rad*180)/Math.PI
}
// ----------------------------------------------------
