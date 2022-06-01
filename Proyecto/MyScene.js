
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { PointerLockControls } from '../libs/PointerLockControls.js'
import * as TWEEN from '../libs/tween.esm.js'
// import { PointerLockControl } from '../libs/PointerLockControls.js'

// Clases de mi proyecto

import { Personaje } from './Personaje.js'
import { Arma } from './Arma.js'
import { Mirilla } from './Mirilla.js'
import { Proyectil } from './Proyectil.js'
import { Robot } from './Robot.js'

 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

const VMIN = 0;
const VMAX = Math.PI;
const CHARACTERSPEED = 1400;
const CERO = 0.01;
const GRAVEDAD = 980;
const FACTORFRENADO = 10;
const VSALTO = 200;
const BULLETSPEED = 3000;
const RETROCESOSPEED = Math.PI/2;
var contador = 0;
// var velocidadMax = 800;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var maxBalas = 40;
var balas = maxBalas;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clockJugador = new THREE.Clock();
const clockRobot = new THREE.Clock();
const clockArma = new THREE.Clock();
var subiendo =  false;
var valor = 450;
var signo = 1
var direccionRobot = new THREE.Vector3(0, 0, 0);
var tiempoUltimoCambioDireccion = 0;
// var alineables = [];

  
class MyScene extends THREE.Scene {
  constructor (myCanvas) { 
    super();
    
    this.alineables = [];

    this.hitboxes = [];

    this.renderer = this.createRenderer(myCanvas);
    
    this.gui = this.createGUI ();    

    this.createLights ();
    
    // this.createMirilla();

    this.createPersonaje();
    
    this.createGround ();
    
    this.createWalls();
    
    this.createBackground();

    this.createRaycaster();

    this.robot = new Robot();
    this.robot.scale.set(0.1, 0.1, 0.1);
    this.robot.position.y = 156/10;
    // this.robot.position.y = 156;
    // this.robot.position.x = 50;
    // this.robot.recalcularHitbox();
    // var hitboxRobot = new THREE.Box3().setFromObject(this.robot);
    // var hitboxRobot = this.robot.getHitbox();
    // var hitboxRobot = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(0, this.robot.position.y-(this.robot.piernaDerecha.longitudBase+this.robot.piernaDerecha.radioPie*2 - this.robot.cabeza.getAnchura())*0.1/2, 0), new THREE.Vector3(this.robot.torso.getRadio()*0.2, (this.robot.torso.getLongitud()+this.robot.cabeza.getAnchura()+this.robot.piernaDerecha.longitudBase+this.robot.piernaDerecha.radioPie*2)*0.1, this.robot.torso.getRadio()*0.2));
    // this.add(new THREE.Box3Helper(hitboxRobot, 0xff0000));
    // this.hitboxes.push(hitboxRobot);
    this.add(this.robot);
    this.alineables.push(this.robot);


    this.mirilla = new Mirilla();
    this.mirilla.position.z = -1;
    this.mirilla.scale.set(0.03, 0.03, 0.03);
    this.add(this.mirilla);
    
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);
    
    this.createCamera ();
    // console.log(this.children);
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

      case "KeyR":
        balas = 40;
        var cargador = document.getElementById('cargador');
        cargador.textContent = balas + "/" + maxBalas;
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

  createRaycaster(){
    this.raycaster = new THREE.Raycaster();
  }

  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2200);
    this.camera.position.set (0, 20, -300);
    var look = new THREE.Vector3 (0,20,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraControls = new PointerLockControls( this.camera, document.body );
    this.cameraControls.minPolarAngle = VMIN;
    this.cameraControls.maxPolarAngle = VMAX;
    var controls = this.cameraControls;
    
    const controles = document.getElementById('controles');
    const juego = document.getElementById('WebGL-output');
    var cargador = document.getElementById('cargador');
    cargador.textContent = balas + "/" + maxBalas;
    
    controles.addEventListener('click', function () {
      controls.lock();
    });
    
    this.cameraControls.addEventListener('lock', function () {
      controles.style.display = 'none';
      juego.style.display = 'block';
      cargador.style.display = 'block';
      clockJugador.start();
    });
    
    this.cameraControls.addEventListener('unlock', function () {
      clockJugador.stop();
      moveBackward = false;
      moveForward = false;
      moveLeft = false;
      moveRight = false;
      cargador.style.display = 'none';
      juego.style.display = 'none';
      controles.style.display = 'block';
    });
    
    this.add(this.cameraControls.getObject());
    this.camera.add(this.mirilla);
    this.camera.add(this.model);
    this.arrayBalas = [];



    // raycaster_crosshair.set(camera.getWorldPosition(),camera.getWorldDirection());
	  // var intersection = raycaster_crosshair.intersectObjects(objetivos, true);

	  // direccion = null;
	  
	  // if (intersection.length > 0)
		//   var direccion = intersection[0].point;
	  
	  // return(direccion);





    var camera = this.camera;
    var cameraControls = this.cameraControls;
    var raycaster = this.raycaster;
    var thisRef = this;
    var arma = this.model;
    var alineables = this.alineables;
    // var posicionBala = new THREE.Vector3(0, 5, -300);

    var idIntervalo;

    function disparar(){
      if(cameraControls.isLocked && balas > 0){
      
        // var look = new THREE.Vector3();
        // look = this.cameraControls.getDirection(look);
        raycaster.setFromCamera(new THREE.Vector2(), camera);
        // console.log(alineables);
        var alineados = raycaster.intersectObjects(alineables, true);
        
        if(alineados.length > 0){
          var masCercano = alineados[0];
          var puntoImpacto = masCercano.point;
          // console.log(puntoImpacto);
          var bala = new Proyectil(thisRef, arma, masCercano);
          // bala.position.z = -150;
          bala.scale.set(0.2, 0.2, 0.2);
          // bala.scale.set(1, 1, 1);
          // console.log(arma);
          // bala.position.x = puntoImpacto.x;
          // bala.position.y = puntoImpacto.y;
          // bala.position.z = puntoImpacto.z;
          // console.log(posicionBala);
          // console.log(arma);
          bala.velocity = BULLETSPEED;
          
          var look = new THREE.Vector3;
          var vecUtil = new THREE.Vector3(cameraControls.getDirection(look).x, 0, cameraControls.getDirection(look).z);
          vecUtil.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/2);
          var direccion = cameraControls.getDirection(look).applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/14).applyAxisAngle(new THREE.Vector3(vecUtil.x, 0, vecUtil.z).normalize(), -Math.PI/20).normalize();
          var distanciaInicialBala = Math.sqrt(Math.pow(-5, 2) + Math.pow(-4.3, 2) + Math.pow(20.3, 2));

          bala.position.x = camera.position.x+direccion.x*distanciaInicialBala;
          bala.position.y = camera.position.y+direccion.y*distanciaInicialBala;
          bala.position.z = camera.position.z+direccion.z*distanciaInicialBala;
          
          bala.setTrayectoria(puntoImpacto, new THREE.Vector3(bala.position.x, bala.position.y, bala.position.z))


          
          
          // nuevaX = nuevaZ*Math.sin(rotacionYRadianes) + nuevaX*Math.cos(rotacionYRadianes);
          // nuevaZ = nuevaZ*Math.cos(rotacionYRadianes) - nuevaX*Math.sin(rotacionYRadianes);

          // bala.position.x = camera.position.x + nuevaX;
          // bala.position.y = camera.position.y + nuevaY;
          // bala.position.z = camera.position.z + nuevaZ;

          // console.log(distanciaInicialBala + " vs " + Math.sqrt(Math.pow(nuevaX, 2) + Math.pow(nuevaY, 2) + Math.pow(nuevaZ, 2)));
          // console.log(distanciaInicialBala == Math.sqrt(Math.pow(nuevaX, 2) + Math.pow(nuevaY, 2) + Math.pow(nuevaZ, 2)))
          // bala.position.x += -2;
          // bala.position.y += -4.3;
          // bala.position.z += 2.3;
          
          // arma.rotation.x += (Math.PI/2);
          subiendo = true;
          clockArma.start();
          arma.add(bala);
          // bala.setIndiceArma(arma.children.length-1);
          // arma.children[arma.children.length-1].rotation.y = Math.PI/8;
          // arma.children[arma.children.length-1].rotation.x = 0;

          thisRef.arrayBalas.push(bala);
          // console.log()
          thisRef.add(bala);
          balas--;
          var cargador = document.getElementById('cargador');
          cargador.textContent = balas + "/" + maxBalas;
          // bala.setIndices(thisRef.arrayBalas.length-1, thisRef.children.length-1);
    
        }
      }
    }

    document.addEventListener('click', disparar);

    document.addEventListener('mousedown', function (){
      idIntervalo = setInterval(disparar, 100);
    });

    document.addEventListener('mouseup', function(){
      clearInterval(idIntervalo);
    })
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
    var groundHitbox = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.1);
    
    ground.position.y = -0.1;
    
    this.alineables.push(ground);
    this.hitboxes.push(groundHitbox);
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
    wall1.geometry.computeBoundingBox();
    this.alineables.push(wall1);
    var wall2 = new THREE.Mesh (geometryWall2, materialWall);
    wall2.geometry.computeBoundingBox();
    this.alineables.push(wall2);
    var wall3 = new THREE.Mesh (geometryWall3, materialWall);
    wall3.geometry.computeBoundingBox();
    this.alineables.push(wall3);
    var wall4 = new THREE.Mesh (geometryWall4, materialWall);
    wall4.geometry.computeBoundingBox();
    this.alineables.push(wall4);

    var wall1Hitbox = new THREE.Box3();
    wall1Hitbox.copy(wall1.geometry.boundingBox);
    this.hitboxes.push(wall1Hitbox);
    var wall2Hitbox = new THREE.Box3();
    wall2Hitbox.copy(wall2.geometry.boundingBox);
    this.hitboxes.push(wall2Hitbox);
    var wall3Hitbox = new THREE.Box3();
    wall3Hitbox.copy(wall3.geometry.boundingBox);
    this.hitboxes.push(wall3Hitbox);
    var wall4Hitbox = new THREE.Box3();
    wall4Hitbox.copy(wall4.geometry.boundingBox);
    this.hitboxes.push(wall4Hitbox);
        
    this.add (wall1);
    this.add (wall2);
    this.add (wall3);
    this.add (wall4);
  }
  
  createBackground(){
    var geometryBackground = new THREE.SphereGeometry (1500,100,100);
    
    var texture = new THREE.TextureLoader().load('../imgs/fondo3.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 2);
    texture.anisotropy =  this.renderer.capabilities.getMaxAnisotropy() 
    
    var materialBackground = new THREE.MeshBasicMaterial ({map: texture});
    materialBackground.side = THREE.BackSide;
    
    var background = new THREE.Mesh (geometryBackground, materialBackground);
    this.alineables.push(background);
        
    this.add (background);
  }

  createGUI () {
    var gui = new GUI();
    
    this.guiControls = {
      lightIntensity : 1,
      axisOnOff : true
    }
    
    var folder = gui.addFolder ('Luz y Ejes');
    
    folder.add (this.guiControls, 'lightIntensity', 0, 3, 0.1)
    .name('Intensidad de la Luz : ')
    .onChange ( (value) => this.setLightIntensity (value) );
    
    folder.add (this.guiControls, 'axisOnOff')
    .name ('Mostrar ejes : ')
    .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }

  createLights () {
    // var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    var ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.add (ambientLight);
    
    this.spotLight = new THREE.SpotLight( 0xffffff, this.guiControls.lightIntensity );
    this.spotLight.position.set( 0, 200, 300);
    this.spotLight.angle = 2*Math.PI/5;
    this.spotLight.penumbra = 0.4;
    this.spotLight.target.position.set(0, 5, -150);

    this.add (this.spotLight);
    this.add (this.spotLight.target);
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
  
  createPersonaje(){
    // this.model = new Personaje(this.gui, "Controles modelo");
    // this.model.scale.set(0.1, 0.1, 0.1);
    // this.model.rotation.y = Math.PI;
    // // this.model.rotation.x = Math.PI/2;
    // this.model.position.y = -10;
    // // this.model.position.y = -5;
    // // this.model.position.z = 1.80;
    // this.model.position.z = -25;
    // // this.add (this.model);
    
    this.model = new Arma();
    this.model.scale.set(0.08, 0.08, 0.08);
    this.model.rotation.y = Math.PI;
    this.model.position.y = -5;
    this.model.position.x = 5;
    this.model.position.z = -5.80;
    this.add(this.model);
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

  actualizaPosicionRobot(){
    // debugger;
    if(clockRobot.running){
      var delta = clockRobot.getDelta();
      // console.log(clockRobot.getElapsedTime());
      var tiempo = Math.floor(clockRobot.getElapsedTime());
      // console.log(tiempo);
      // console.log(tiempoUltimoCambioDireccion);
      if(tiempo-tiempoUltimoCambioDireccion > 2){
        tiempoUltimoCambioDireccion = tiempo;
        direccionRobot.x = Math.random()*1/direccionRobot.x;
        direccionRobot.z = Math.random()*1/direccionRobot.z;
        direccionRobot.normalize();
        this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
      }
      this.robot.position.x += direccionRobot.x * CHARACTERSPEED/10*delta;
      this.robot.position.z += direccionRobot.z * CHARACTERSPEED/10*delta;
      if(this.robot.position.x > 496 || this.robot.position.x < -496){
        if(this.robot.position.x > 0){
          this.robot.position.x = 496;
        }
        else{
          this.robot.position.x = -496;
        }
        direccionRobot.x = direccionRobot.x*(-1);
        this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
      }
      if(this.robot.position.z > 496 || this.robot.position.z < -496){
        if(this.robot.position.z > 0){
          this.robot.position.z = 496;
        }
        else{
          this.robot.position.z = -496;
        }
        direccionRobot.z = direccionRobot.z*(-1);
        this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
      }

    }
  }

  actualizaArma(){
    if(clockArma.running){
      if(subiendo && this.model.rotation.x < Math.PI/20){
        this.model.rotation.x += RETROCESOSPEED * clockArma.getDelta(); 
      }
      else if(subiendo && this.model.rotation.x >= Math.PI/20){
        subiendo = false;
      }
      else if(!subiendo && this.model.rotation.x > 0){
        this.model.rotation.x -= RETROCESOSPEED * clockArma.getDelta(); 
      }
      else if(!subiendo && this.model.rotation.x <= 0){
        this.model.rotation.x = 0;
        clockArma.stop();
      }
    }
  }
  
  actualizaPosicion(){
    if ( this.cameraControls.isLocked === true ) {
      var delta = clockJugador.getDelta();

      velocity.x -= velocity.x * FACTORFRENADO * delta;
      velocity.z -= velocity.z * FACTORFRENADO * delta;
      
      velocity.y -= GRAVEDAD * delta;
      
      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize();
      
      if(moveForward || moveBackward){
        velocity.z -= direction.z * CHARACTERSPEED * delta;
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
      
      if(this.cameraControls.getObject().position.y < 20){
        velocity.y = 0;
        this.cameraControls.getObject().position.y = 20;
        canJump = true;
      }
      if(Math.abs(this.cameraControls.getObject().position.x) > 496){
        var signo = this.cameraControls.getObject().position.x / Math.abs(this.cameraControls.getObject().position.x);
        this.cameraControls.getObject().position.x = 496 * signo;
      }
      if(Math.abs(this.cameraControls.getObject().position.z) > 496){
        var signo = this.cameraControls.getObject().position.z / Math.abs(this.cameraControls.getObject().position.z);
        this.cameraControls.getObject().position.z = 496 * signo;
      }

      // var look = this.cameraControls.getDirection();
      // var look = new THREE.Vector3 (0,0,0);
      // this.camera.children[0].rotation
      // look = this.cameraControls.getDirection(look);
      // var x = look.x, y = look.y, z = look.z;
      // var gradosCompensacion;
      // if(y > 0){
      //   gradosCompensacion = Math.atan(Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2)) / y) - Math.PI/2;
      // }
      // else if(y < 0){
      //   gradosCompensacion = Math.atan(Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2)) / y) + Math.PI/2;
      // }
      // else{
      //   gradosCompensacion = 0;
      // }
      // this.camera.children[0].rotation.x = gradosCompensacion;
      // this.camera.children[0].position.y = -10;
      // this.camera.children[0].position.z = -40.8;
      // console.log(this.cameraControls.getDirection(look));
      // console.log((180/Math.PI)*gradosCompensacion);

    }
  }

  borraBala(bala){
    this.remove(bala);
    var indice = this.arrayBalas.indexOf(bala);
    this.arrayBalas.splice(indice, 1);
  }
  

  update () {
    if(this.cameraControls.isLocked){
      // if(contador == 0){
      //   // console.log(this.arrayBalas);
      //   // console.log(this.array)
      // }
      // contador++;
      // if(contador >= 2000){
      //   contador = 0;
      // }
      this.renderer.render (this, this.getCamera());

      this.actualizaPosicionRobot();
    
      this.actualizaArma();

      // this.model.update();
      this.actualizaPosicion();
  
      for(var i = 0; i<this.arrayBalas.length; i++){
        var colision = this.arrayBalas[i].update();
        if(colision){
          var borrar = true;
          for(var j=3; j<9; j++){
            if(this.arrayBalas[i].getObjetoImpacto().object.id == this.children[j].id){
              borrar = false;
            }
          }
          if(borrar){
            var objeto = this.arrayBalas[i].getObjetoImpacto().object;
            while(objeto.parent != this){
              objeto = objeto.parent;
            }
            this.getObjectById(objeto.id).deleteGeometry();
            this.getObjectById(objeto.id).deleteMaterial();
            // var id = objeto.id;
            for(var j=0; j<this.alineables.length; j++){
              // console.log(this.alineables[j]);
              if(objeto.id == this.alineables[j].id){
                this.alineables.splice(j, 1);
              }
            }
            // objeto.geometry.dispose();
            // objeto.material.dispose();
            this.remove(objeto);
          }

          this.arrayBalas[i].destruir();
          // if(this.arrayBalas[i].objetoImpacto.id != this.ground){

          // }
        }
      }
    }

    requestAnimationFrame(() => this.update());
  }
}


$(function () {
  var scene = new MyScene("#WebGL-output");
  
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  direccionRobot.x = Math.random();
  direccionRobot.z = Math.random();
  direccionRobot.normalize();
  scene.robot.lookAt(scene.robot.position.x + direccionRobot.x, scene.robot.position.y, scene.robot.position.z + direccionRobot.z);
  clockRobot.start();
  scene.update();
});
