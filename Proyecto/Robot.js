import * as THREE from '../libs/three.module.js'
import { CabezaRobot } from './CabezaRobot.js'
import { TorsoRobot } from './TorsoRobot.js'
import { BrazoRobot } from './BrazoRobot.js'
import { PiernaRobot } from './PiernaRobot.js'

class Robot extends THREE.Object3D {
  constructor() {
    super();

    this.torso = this.createTorso();
    this.cabeza = this.createCabeza();
    this.brazoIzquierdo = this.createBrazo('I');
    this.brazoDerecho = this.createBrazo('D');
    this.piernaIzquierda = this.createPierna('I');
    this.piernaDerecha = this.createPierna('D');
    // this.hitbox = this.torso.getHitbox().union(this.cabeza.getHitbox()).union(this.brazoIzquierdo.getHitbox()).union(this.brazoDerecho.getHitbox()).union(this.piernaIzquierda.getHitbox()).union(this.piernaDerecha.getHitbox());
    // this.hitbox = new THREE.Box3();
    // this.add(this.hitbox);
  }

  createCabeza(){
    var cabeza = new CabezaRobot();
    cabeza.position.y = this.torso.getLongitud()/2 + cabeza.getAnchura()/2;
    cabeza.hitbox.translate(0, this.torso.getLongitud()/2 + cabeza.getAnchura()/2, 0);
    this.add(cabeza);
    return cabeza;
  }

  createTorso(){
    var torso = new TorsoRobot();
    this.add(torso);
    return torso;
  }

  createBrazo(lado){
    var brazo = new BrazoRobot(lado);
    var rotacion = 0;
    var offset = this.torso.getRadio();
    if(lado == 'I'){
        rotacion = Math.PI;
        offset = offset * (-1);
    }
    brazo.rotation.y = rotacion;
    brazo.position.x = offset;
    brazo.position.y = 10;
    this.add(brazo);
    return brazo;
  }

  createPierna(lado){
    var pierna = new PiernaRobot();
    var offset = 15;
    if(lado == 'I'){
        offset = offset * (-1);
    }
    pierna.position.x = offset;
    pierna.position.y = -this.torso.getLongitud()/2;
    this.add(pierna);
    return pierna;
  }
  
  getHitbox(){
    return this.hitbox;
  }

  getHitboxes(){
    var array = [];
    // array.push(this.torso.getHitbox());
    array.push(new THREE.Box3());
    array.push(this.cabeza.getHitbox());
    array.push(this.brazoIzquierdo.getHitbox());
    array.push(this.brazoDerecho.getHitbox());
    array.push(this.piernaIzquierda.getHitbox());
    array.push(this.piernaDerecha.getHitbox());
    return array;
  }

  recalcularHitbox(){
    this.torso.recalcularHitbox();
    this.cabeza.recalcularHitbox();
    this.brazoIzquierdo.recalcularHitbox();
    this.brazoDerecho.recalcularHitbox();
    this.piernaIzquierda.recalcularHitbox();
    this.piernaDerecha.recalcularHitbox();
    this.hitbox = this.torso.getHitbox().union(this.cabeza.getHitbox()).union(this.brazoIzquierdo.getHitbox()).union(this.brazoDerecho.getHitbox()).union(this.piernaIzquierda.getHitbox()).union(this.piernaDerecha.getHitbox());
  }

  deleteGeometry(){
    this.torso.deleteGeometry();
    this.cabeza.deleteGeometry();
    this.brazoIzquierdo.deleteGeometry();
    this.brazoDerecho.deleteGeometry();
    this.piernaIzquierda.deleteGeometry();
    this.piernaDerecha.deleteGeometry();
  }
  
  deleteMaterial(){
    this.torso.deleteMaterial();
    this.cabeza.deleteMaterial();
    this.brazoIzquierdo.deleteMaterial();
    this.brazoDerecho.deleteMaterial();
    this.piernaIzquierda.deleteMaterial();
    this.piernaDerecha.deleteMaterial();
  }

  update () {

  }
}

export { Robot }
