
// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { PointerLockControls } from '../libs/PointerLockControls.js'

// Clases de mi proyecto

import { Arma } from './Arma.js'
import { Mirilla } from './Mirilla.js'
import { Proyectil } from './Proyectil.js'
import { Robot } from './Robot.js'

//Constantes útiles
const VMIN = 0;
const VMAX = Math.PI;
const CHARACTERSPEED = 1400;
const CHARACTERHEIGHT = 20;
const CERO = 0.01;
const GRAVEDAD = 980;
const FACTORFRENADO = 10;
const VSALTO = 200;
const BULLETSPEED = 3000;
const RETROCESOSPEED = Math.PI/2;
const MIRILLASCALEFACTOR = 0.03;
const MIRILLAOFFSET = -1;
const ROBOTSCALEFACTOR = 0.1;
const XZLIMIT = 496;
const BULLETSCALEFACTOR = 0.2;
const ARMASCALEFACTOR = 0.08;
const RETROCESORANGO = Math.PI/20;

//Variables de control de movimiento
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const clockJugador = new THREE.Clock();

//Variables de control de disparo
const MAXBALAS = 40;
var balas = MAXBALAS;
var subiendo =  false;
const clockArma = new THREE.Clock();

//Variables de control de movimiento del robot
var direccionRobot = new THREE.Vector3(0, 0, 0);
var tiempoUltimoCambioDireccion = 0;
const clockRobot = new THREE.Clock();

//Variables de control de partida
const TMAX = 30;
var score = 0;
var acabado = false;
const clockPartida = new THREE.Clock();
  
//Escena
class MyScene extends THREE.Scene {
  constructor (myCanvas) { 
    super();

    this.arrayBalas = [];
    
    this.alineables = [];

    this.renderer = this.createRenderer(myCanvas);
    
    this.createLights ();
    
    this.createPersonaje();
    
    this.createGround ();
    
    this.createWalls();
    
    this.createBackground();
    
    this.createRaycaster();
    
    this.createRobot();
    
    this.createMirilla();
    
    this.createCamera ();

    this.createListeners();
  }

  //Event listener al pulsar teclas. Controla movimiento, salto y recarga
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
        balas = MAXBALAS;
        var cargador = document.getElementById('cargador');
        cargador.textContent = balas + "/" + MAXBALAS;
        break;
        
    }
      
  }
    
  //Event listener al soltar teclas. Controla movimiento
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

  //Creación de mirilla. Z = -1 para que esté en frente de la cámara
  createMirilla(){
    this.mirilla = new Mirilla();
    this.mirilla.position.z = MIRILLAOFFSET;
    this.mirilla.scale.set(MIRILLASCALEFACTOR, MIRILLASCALEFACTOR, MIRILLASCALEFACTOR);
    this.add(this.mirilla);
  }

  //Creación de robot. El robot es un enemigo destruible con disparos
  createRobot(){
    this.robot = new Robot();
    this.robot.scale.set(ROBOTSCALEFACTOR, ROBOTSCALEFACTOR, ROBOTSCALEFACTOR);
    this.robot.position.y = (this.robot.torso.getLongitud()/2 + this.robot.piernaDerecha.longitudBase + this.robot.piernaDerecha.radioPie * 2) * ROBOTSCALEFACTOR;
    this.robot.position.x = (Math.random()*2-1)*XZLIMIT;
    this.robot.position.z = (Math.random()*2-1)*XZLIMIT;
    this.add(this.robot);
    this.alineables.push(this.robot);
  }

  //Creación del raycaster. Se usará para calcular una trayectoria de bala así como para detectar colisiones
  createRaycaster(){
    this.raycaster = new THREE.Raycaster();
  }

  //Creación de la cámara y de sus controles. Utilizada librería externa para el control de la cámara
  createCamera () {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2200);
    this.camera.position.set (0, CHARACTERHEIGHT, -300);
    var look = new THREE.Vector3 (0, CHARACTERHEIGHT, 0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    this.cameraControls = new PointerLockControls( this.camera, document.body );
    this.cameraControls.minPolarAngle = VMIN;
    this.cameraControls.maxPolarAngle = VMAX;
    this.cameraControls.unlock();
    var controls = this.cameraControls;
    
    const controles = document.getElementById('controles');
    const juego = document.getElementById('WebGL-output');
    var cargador = document.getElementById('cargador');
    cargador.textContent = balas + "/" + MAXBALAS;
    this.tiempoBloque = document.getElementById('tiempo');
    this.tiempoBloque.textContent = "Tiempo restante: " + TMAX.toString();
    this.puntuacionBloque = document.getElementById('puntuacion');
    this.puntuacionBloque.textContent = "Puntuación: 0";
    var tiempoBloque = this.tiempoBloque;
    var puntuacionBloque = this.puntuacionBloque;
    
    controles.addEventListener('click', function () {
      controls.lock();
    });
    
    //El ratón se bloquea y desaparace al hacer click, pasando su función a ser el control de la cámara
    this.cameraControls.addEventListener('lock', function () {
      controles.style.display = 'none';
      juego.style.display = 'block';
      cargador.style.display = 'block';
      tiempoBloque.style.display = 'block';
      puntuacionBloque.style.display = 'block';
      clockJugador.start();
      var oldElapsed = clockPartida.getElapsedTime();
      clockPartida.start();
      clockPartida.elapsedTime = oldElapsed;
      clockRobot.start();
      clockArma.start();
    });
    
    //El ratón se desbloquea y aparece al pulsar ESC, volviendo a su función normal
    this.cameraControls.addEventListener('unlock', function () {
      //Mientras dure la partida
      if(!acabado){
        clockPartida.stop();
        clockRobot.stop();
        clockArma.stop();
        clockJugador.stop();
        moveBackward = false;
        moveForward = false;
        moveLeft = false;
        moveRight = false;
        cargador.style.display = 'none';
        tiempoBloque.style.display = 'none';
        puntuacionBloque.style.display = 'none';
        juego.style.display = 'none';
        controles.style.display = 'block';
      }
      //Una vez acabe la partida
      else{
        var pantallaFinal = document.getElementById('pantallaFinal');
        pantallaFinal.textContent = "PUNTUACION FINAL: " + score.toString();

        cargador.style.display = 'none';
        tiempoBloque.style.display = 'none';
        puntuacionBloque.style.display = 'none';
        juego.style.display = 'none';
        pantallaFinal.style.display = 'block';
      }
    });
    
    //Añado mirilla y arma a la cámara para que se muevan con la cámara
    this.add(this.cameraControls.getObject());
    this.camera.add(this.mirilla);
    this.camera.add(this.arma);
  }

  //Crea los listeners para disparos, recarga, movimiento y salto
  createListeners(){
    var camera = this.camera;
    var cameraControls = this.cameraControls;
    var raycaster = this.raycaster;
    var thisRef = this;
    var arma = this.arma;
    var alineables = this.alineables;

    var idIntervalo;

    function disparar(){
      if(cameraControls.isLocked && balas > 0){
        raycaster.setFromCamera(new THREE.Vector2(), camera);
        var alineados = raycaster.intersectObjects(alineables, true);
        
        if(alineados.length > 0){
          var masCercano = alineados[0];
          var puntoImpacto = masCercano.point;
          var bala = new Proyectil(thisRef, arma, masCercano);
          bala.scale.set(BULLETSCALEFACTOR, BULLETSCALEFACTOR, BULLETSCALEFACTOR);
          bala.velocity = BULLETSPEED;
          
          var look = new THREE.Vector3();
          var vecUtil = new THREE.Vector3(cameraControls.getDirection(look).x, 0, cameraControls.getDirection(look).z);
          vecUtil.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/2);
          var direccion = cameraControls.getDirection(look).applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI/14).applyAxisAngle(new THREE.Vector3(vecUtil.x, 0, vecUtil.z).normalize(), -Math.PI/20).normalize();
          var distanciaInicialBala = Math.sqrt(Math.pow(-5, 2) + Math.pow(-4.3, 2) + Math.pow(20.3, 2));

          bala.position.x = camera.position.x+direccion.x*distanciaInicialBala;
          bala.position.y = camera.position.y+direccion.y*distanciaInicialBala;
          bala.position.z = camera.position.z+direccion.z*distanciaInicialBala;
          
          bala.setTrayectoria(puntoImpacto, new THREE.Vector3(bala.position.x, bala.position.y, bala.position.z))

          subiendo = true;
          clockArma.start();

          thisRef.arrayBalas.push(bala);
          thisRef.add(bala);
          balas--;
          var cargador = document.getElementById('cargador');
          cargador.textContent = balas + "/" + MAXBALAS;    
        }
      }
    }

    //Modo semiautomático de disparo
    document.addEventListener('click', disparar);

    //Modo automático de disparo
    document.addEventListener('mousedown', function (){
      idIntervalo = setInterval(disparar, 100);
    });

    document.addEventListener('mouseup', function(){
      clearInterval(idIntervalo);
    });

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }
  
  //Creación del suelo de la escena. No destruible con disparos
  createGround () {
    var geometryGround = new THREE.BoxGeometry (XZLIMIT*2+8,0.2,XZLIMIT*2+8);
    
    var texture = new THREE.TextureLoader().load('../imgs/suelo3.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(64, 64);
    texture.anisotropy =  this.renderer.capabilities.getMaxAnisotropy() 
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    ground.position.y = -0.1;
    
    this.alineables.push(ground);
    this.add (ground);
  }

  //Creación de los muros de la escena. No destruibles con disparos
  createWalls(){
    var texture = new THREE.TextureLoader().load('../imgs/muro1.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(128, 4);
    texture.anisotropy =  this.renderer.capabilities.getMaxAnisotropy();
    
    var materialWall = new THREE.MeshPhongMaterial ({map: texture, shininess: 20, color: 0xaaaaaa});
    
    var geometryWall = new THREE.BoxGeometry (XZLIMIT*2+8,40,1);
    geometryWall.translate(0, 12.5, 500.1);
    
    var geometryWall1 = new THREE.BoxGeometry(), geometryWall2 = new THREE.BoxGeometry(), geometryWall3 = new THREE.BoxGeometry(), geometryWall4 = new THREE.BoxGeometry();
    geometryWall1.copy(geometryWall);
    geometryWall2.copy(geometryWall).rotateY(Math.PI/2);
    geometryWall3.copy(geometryWall).rotateY(Math.PI);
    geometryWall4.copy(geometryWall).rotateY(-Math.PI/2);
    
    var wall1 = new THREE.Mesh (geometryWall1, materialWall);
    this.alineables.push(wall1);
    var wall2 = new THREE.Mesh (geometryWall2, materialWall);
    this.alineables.push(wall2);
    var wall3 = new THREE.Mesh (geometryWall3, materialWall);
    this.alineables.push(wall3);
    var wall4 = new THREE.Mesh (geometryWall4, materialWall);
    this.alineables.push(wall4);
        
    this.add (wall1);
    this.add (wall2);
    this.add (wall3);
    this.add (wall4);
  }
  
  //Creación del fondo estrellado. Es una esfera que engloba el escenario con la textura aplicada por la parte interior
  createBackground(){
    var geometryBackground = new THREE.SphereGeometry (XZLIMIT*2+508,100,100);
    
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

  //Creación de las luces de la escena
  createLights () {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (ambientLight);

    this.spotLight = new THREE.SpotLight( 0xffffff, 1.5);
    this.spotLight.position.set( 0, 200, 0);
    this.spotLight.angle = Math.PI/2;
    this.spotLight.penumbra = 0.4;
    this.spotLight.target.position.set(0, 0, 0);

    this.add (this.spotLight);
    this.add (this.spotLight.target);
  }
  
  //Creación del renderer de la escena
  createRenderer (myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  //Creación del arma que representa el jugador en primera persona de la escena
  createPersonaje(){    
    this.arma = new Arma();
    this.arma.scale.set(ARMASCALEFACTOR, ARMASCALEFACTOR, ARMASCALEFACTOR);
    this.arma.rotation.y = Math.PI;
    this.arma.position.y = -5;
    this.arma.position.x = 5;
    this.arma.position.z = -5.80;
    this.add(this.arma);
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
    if(clockRobot.running){
      var delta = clockRobot.getDelta();
      var tiempo = Math.floor(clockRobot.getElapsedTime());
      
      if(tiempo-tiempoUltimoCambioDireccion > 1){
        tiempoUltimoCambioDireccion = tiempo;
        direccionRobot.x = Math.random()*2-1;
        direccionRobot.z = Math.random()*2-1;
        direccionRobot.normalize();
        this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
      }

      this.robot.position.x += direccionRobot.x * CHARACTERSPEED/10*delta;
      this.robot.position.z += direccionRobot.z * CHARACTERSPEED/10*delta;
      if(this.robot.position.x > XZLIMIT || this.robot.position.x < -XZLIMIT){
        if(this.robot.position.x > 0){
          this.robot.position.x = XZLIMIT;
        }
        else{
          this.robot.position.x = -XZLIMIT;
        }
        direccionRobot.x = direccionRobot.x*(-1);
        this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
      }
      if(this.robot.position.z > XZLIMIT || this.robot.position.z < -XZLIMIT){
        if(this.robot.position.z > 0){
          this.robot.position.z = XZLIMIT;
        }
        else{
          this.robot.position.z = -XZLIMIT;
        }
        direccionRobot.z = direccionRobot.z*(-1);
        this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
      }

    }
  }

  actualizaArma(){
    if(clockArma.running){
      if(subiendo && this.arma.rotation.x < RETROCESORANGO){
        this.arma.rotation.x += RETROCESOSPEED * clockArma.getDelta(); 
      }
      else if(subiendo && this.arma.rotation.x >= RETROCESORANGO){
        subiendo = false;
      }
      else if(!subiendo && this.arma.rotation.x > 0){
        this.arma.rotation.x -= RETROCESOSPEED * clockArma.getDelta(); 
      }
      else if(!subiendo && this.arma.rotation.x <= 0){
        this.arma.rotation.x = 0;
        clockArma.stop();
      }
    }
  }
  
  actualizaPosicion(){
    if(this.cameraControls.isLocked === true){
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
        
      this.cameraControls.moveRight( - velocity.x * delta );
      this.cameraControls.moveForward( - velocity.z * delta );
      this.cameraControls.getObject().position.y += ( velocity.y * delta );
      
      if(this.cameraControls.getObject().position.y < CHARACTERHEIGHT){
        velocity.y = 0;
        this.cameraControls.getObject().position.y = CHARACTERHEIGHT;
        canJump = true;
      }
      if(Math.abs(this.cameraControls.getObject().position.x) > XZLIMIT){
        var signo = this.cameraControls.getObject().position.x / Math.abs(this.cameraControls.getObject().position.x);
        this.cameraControls.getObject().position.x = XZLIMIT * signo;
      }
      if(Math.abs(this.cameraControls.getObject().position.z) > XZLIMIT){
        var signo = this.cameraControls.getObject().position.z / Math.abs(this.cameraControls.getObject().position.z);
        this.cameraControls.getObject().position.z = XZLIMIT * signo;
      }
    }
  }

  borraBala(bala){
    this.remove(bala);
    var indice = this.arrayBalas.indexOf(bala);
    this.arrayBalas.splice(indice, 1);
  }
  
  muestraPantallaFinal(){
    this.cameraControls.unlock();
  }

  update () {
    this.tiempoBloque.textContent = "Tiempo restante: " + (TMAX-Math.round(clockPartida.getElapsedTime())).toString();
    if(this.cameraControls.isLocked){

      this.renderer.render (this, this.getCamera());

      this.actualizaPosicionRobot();
    
      this.actualizaArma();

      this.actualizaPosicion();
  
      for(var i = 0; i<this.arrayBalas.length; i++){
        var colision = this.arrayBalas[i].update();
        if(colision){
          var borrar = true;
          //Objetos no borrables
          for(var j=3; j<9; j++){
            if(this.arrayBalas[i].getObjetoImpacto().object.id == this.children[j].id){
              borrar = false;
            }
          }

          if(borrar){
            var objeto = this.arrayBalas[i].getObjetoImpacto().object;
            if(objeto != null){
              while(objeto.parent != null && objeto.parent != this){
                  objeto = objeto.parent;
              }

              if(objeto.parent == this){
                score += 500;
                this.puntuacionBloque.textContent = "Puntuacion: " + score.toString();
                //Lo borro y lo creo de nuevo para evitar que puedan contabilizarse más de 1 vez los puntos, 
                //ya que después de la primera si se contabiliza un impacto ya ocurrido, no se entrará en este if
                this.getObjectById(objeto.id).deleteGeometry();
                this.getObjectById(objeto.id).deleteMaterial();
                for(var j=0; j<this.alineables.length; j++){
                  if(objeto.id == this.alineables[j].id){
                    this.alineables.splice(j, 1);
                  }
                }

                this.remove(objeto);
                clockRobot.stop();
    
                this.robot = new Robot();
                this.robot.scale.set(0.1, 0.1, 0.1);
                this.robot.position.y = 156/10;
                this.robot.position.x = (Math.random()*2-1)*XZLIMIT;
                this.robot.position.z = (Math.random()*2-1)*XZLIMIT;
                this.add(this.robot);
                this.alineables.push(this.robot);
                direccionRobot.x = Math.random()*2-1;
                direccionRobot.z = Math.random()*2-1;
                direccionRobot.normalize();
                this.robot.lookAt(this.robot.position.x + direccionRobot.x, this.robot.position.y, this.robot.position.z + direccionRobot.z);
                clockRobot.start();
              }
            }
          }

          this.arrayBalas[i].destruir();
        }
      }
    }

    if(clockPartida.getElapsedTime() < TMAX){
      requestAnimationFrame(() => this.update());
    }
    else{
      acabado = true;
      this.muestraPantallaFinal();
    }
  }
}


$(function () {
  var scene = new MyScene("#WebGL-output");
  
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  direccionRobot.x = Math.random()*2-1;
  direccionRobot.z = Math.random()*2-1;
  direccionRobot.normalize();
  scene.robot.lookAt(scene.robot.position.x + direccionRobot.x, scene.robot.position.y, scene.robot.position.z + direccionRobot.z);
  clockRobot.start();
  clockPartida.stop();
  scene.update();
  // scene.cameraControls.unlock();
});
