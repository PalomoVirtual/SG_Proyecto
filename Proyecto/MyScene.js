
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { FirstPersonControls } from '../libs/FirstPersonControls.js'
import { PointerLockControls } from '../libs/PointerLockControls.js'

// Clases de mi proyecto

import { Grapadora } from './Grapadora.js'

 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

const VMIN = 0;
const VMAX = Math.PI;
const CHARACTERSPEED = 800;
const CERO = 0.01;
const GRAVEDAD = 980;
const FACTORFRENADO = 10;
const VSALTO = 200;
var velocidadMax = 800;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clock = new THREE.Clock();

  
class MyScene extends THREE.Scene {
  constructor (myCanvas) { 
    super();
    
    this.renderer = this.createRenderer(myCanvas);
    
    this.gui = this.createGUI ();    

    this.createLights ();
    
    this.createCamera ();
    
    this.createGround ();

    this.createWalls();

    // this.createBackground();

    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);
    
    this.model = new Grapadora(this.gui, "Controles de la Grapadora");
    this.add (this.model);
  }

  onKeyDown(event){
  
    switch(event.code) {
      
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;
          
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;
              
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;
                  
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
  
      case 'Space':
        if (canJump === true){
          velocity.y += VSALTO;
        }
        canJump = false;
        break;
        
    }
      
  }
    
  onKeyUp(event){
    
    switch(event.code){
      
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;
        
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;
        
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;
          
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
        
    }
  }

  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (-450, 3, 6);
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraControls = new PointerLockControls( this.camera, document.body );
    this.cameraControls.minPolarAngle = VMIN;
    this.cameraControls.maxPolarAngle = VMAX;
    var controls = this.cameraControls;
    
    const controles = document.getElementById('controles');
    const juego = document.getElementById('WebGL-output');
    
    controles.addEventListener('click', function () {
      controls.lock();
    });
    
    this.cameraControls.addEventListener('lock', function () {
      controles.style.display = 'none';
      juego.style.display = 'block';
      clock.start();
    });
    
    this.cameraControls.addEventListener('unlock', function () {
      clock.stop();
      moveBackward = false;
      moveForward = false;
      moveLeft = false;
      moveRight = false;
      juego.style.display = 'none';
      controles.style.display = 'block';
    });
    
    this.add(this.cameraControls.getObject());
    
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }
  
  createGround () {
    var geometryGround = new THREE.BoxGeometry (1000,0.2,1000);
    
    var texture = new THREE.TextureLoader().load('../imgs/suelo3.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(64, 64);
    texture.anisotropy =  this.renderer.capabilities.getMaxAnisotropy() 
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    ground.position.y = -0.1;
    
    this.add (ground);
  }

  createWalls(){
    
    var texture = new THREE.TextureLoader().load('../imgs/muro1.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(128, 4);
    texture.anisotropy =  this.renderer.capabilities.getMaxAnisotropy();
    
    var materialWall = new THREE.MeshPhongMaterial ({map: texture, shininess: 20, color: 0xaaaaaa});
    
    var geometryWall = new THREE.BoxGeometry (1000,40,1);
    geometryWall.translate(0, 12.5, 500.1);
    
    var geometryWall1 = new THREE.BoxGeometry(), geometryWall2 = new THREE.BoxGeometry(), geometryWall3 = new THREE.BoxGeometry(), geometryWall4 = new THREE.BoxGeometry();
    geometryWall1.copy(geometryWall);
    geometryWall2.copy(geometryWall).rotateY(Math.PI/2);
    geometryWall3.copy(geometryWall).rotateY(Math.PI);
    geometryWall4.copy(geometryWall).rotateY(-Math.PI/2);
    
    var wall1 = new THREE.Mesh (geometryWall1, materialWall);
    var wall2 = new THREE.Mesh (geometryWall2, materialWall);
    var wall3 = new THREE.Mesh (geometryWall3, materialWall);
    var wall4 = new THREE.Mesh (geometryWall4, materialWall);
        
    this.add (wall1);
    this.add (wall2);
    this.add (wall3);
    this.add (wall4);
  }
  
  createBackground(){
    var geometryGround = new THREE.BoxGeometry (30,30,30);
    
    var texture = new THREE.TextureLoader().load('../imgs/suelo4.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(64, 64);
    texture.anisotropy =  this.renderer.capabilities.getMaxAnisotropy() 
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    ground.position.y = -0.1;
    
    this.add (ground);
  }

  createGUI () {
    var gui = new GUI();
    
    this.guiControls = {
      lightIntensity : 1,
      axisOnOff : true
    }
    
    var folder = gui.addFolder ('Luz y Ejes');
    
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
    .name('Intensidad de la Luz : ')
    .onChange ( (value) => this.setLightIntensity (value) );
    
    folder.add (this.guiControls, 'axisOnOff')
    .name ('Mostrar ejes : ')
    .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (ambientLight);
    
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 60, 60, 40 );
    this.add (this.spotLight);
  }
  
  setLightIntensity (valor) {
    this.spotLight.intensity = valor;
  }
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    return this.camera;
  }
  
  setCameraAspect (ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    this.setCameraAspect (window.innerWidth / window.innerHeight);

    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }
  
  actualizaPosicion(){
    if ( this.cameraControls.isLocked === true ) {
      var delta = clock.getDelta();

      velocity.x -= velocity.x * FACTORFRENADO * delta;
      velocity.z -= velocity.z * FACTORFRENADO * delta;
      
      velocity.y -= GRAVEDAD * delta;
      
      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize();
      
      if(moveForward || moveBackward){
        velocity.z -= direction.z * velocidadMax * delta;
      }
      else{
        if(Math.abs(velocity.z) <= CERO){
          velocity.z = 0;
        }
      }

      if(moveLeft || moveRight){
        velocity.x -= direction.x * CHARACTERSPEED * delta;
      }
      else{
        if(Math.abs(velocity.x) <= CERO){
          velocity.x = 0;
        }
      }

      // if ( onObject === true ) {
        
        //   velocity.y = Math.max( 0, velocity.y );
        //   canJump = true;
        
        // }
        
      this.cameraControls.moveRight( - velocity.x * delta );
      this.cameraControls.moveForward( - velocity.z * delta );
      this.cameraControls.getObject().position.y += ( velocity.y * delta );
      
      if(this.cameraControls.getObject().position.y < 10){
        velocity.y = 0;
        this.cameraControls.getObject().position.y = 10;
        canJump = true;
      }
      // if(Math.abs(this.cameraControls.getObject().position.x) > 496){
      //   velocity.x = 0;
      //   var signo = this.cameraControls.getObject().position.x / Math.abs(this.cameraControls.getObject().position.x);
      //   this.cameraControls.getObject().position.x = 496 * signo;
      // }
      // if(Math.abs(this.cameraControls.getObject().position.z) > 496){
      //   velocity.z = 0;
      //   var signo = this.cameraControls.getObject().position.z / Math.abs(this.cameraControls.getObject().position.z);
      //   this.cameraControls.getObject().position.z = 496 * signo;
      // }

    }
  }

  update () {

    this.renderer.render (this, this.getCamera());
  
    // this.model.update();
    this.actualizaPosicion();

    requestAnimationFrame(() => this.update());
  }
}


$(function () {
  var scene = new MyScene("#WebGL-output");
  
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  scene.update();
});
