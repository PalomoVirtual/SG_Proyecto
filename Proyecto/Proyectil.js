
import * as THREE from '../libs/three.module.js'

const MINCOLISION = 5;

class Proyectil extends THREE.Object3D {
  constructor(escena, arma, masCercano) {
    super();

    var bulletMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 1, color: 0xd4af37});
    var bulletGeometry = new THREE.SphereGeometry(1, 200, 200);
    this.bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    this.velocity = 0;
    this.clock = new THREE.Clock();
    this.escena = escena;
    this.arma = arma;
    this.objetoImpacto = masCercano;

    this.add(this.bullet);
  }

  setTrayectoria(puntoImpacto, puntoOrigen){
    this.puntoActual = new THREE.Vector3(); 
    this.puntoActual = puntoOrigen;
    this.puntoImpacto = puntoImpacto;
    this.trayectoria = new THREE.Vector3(puntoImpacto.x-puntoOrigen.x, puntoImpacto.y-puntoOrigen.y, puntoImpacto.z-puntoOrigen.z);
    this.trayectoriaNormalized = new THREE.Vector3().copy(this.trayectoria).normalize();
    this.longitudTrayectoria = Math.sqrt(Math.pow(this.trayectoria.x, 2) + Math.pow(this.trayectoria.y, 2) + Math.pow(this.trayectoria.z, 2));
  }

  getObjetoImpacto(){
    return this.objetoImpacto;
  }

  destruir(){
    this.escena.borraBala(this);
    this.bullet.geometry.dispose();
    this.bullet.material.dispose();
  }

  colisiona(siguientePunto){
    var vecUtil = new THREE.Vector3(siguientePunto.x-this.puntoImpacto.x, siguientePunto.y-this.puntoImpacto.y, siguientePunto.z-this.puntoImpacto.z).normalize();
    var vecUtil2 = new THREE.Vector3(this.puntoActual.x-this.puntoImpacto.x, this.puntoActual.y-this.puntoImpacto.y, this.puntoActual.z-this.puntoImpacto.z).normalize();

    if((vecUtil.x > 0 && vecUtil2.x < 0) || (vecUtil.y > 0 && vecUtil2.y < 0) || (vecUtil.z > 0 && vecUtil2.z < 0) ){
      return true;
    }

    return false;
  }
  
  update () {
      if(this.velocity > 0){
        var incrementoPorcentual = this.clock.getDelta() * this.velocity / this.longitudTrayectoria;
        var siguientePunto = new THREE.Vector3(this.puntoActual.x + this.trayectoria.x*incrementoPorcentual, this.puntoActual.y + this.trayectoria.y*incrementoPorcentual,
            this.puntoActual.z + this.trayectoria.z*incrementoPorcentual);
        var colisiona = this.colisiona(siguientePunto);
        if(!colisiona){
          this.position.x = siguientePunto.x;
          this.position.y = siguientePunto.y;
          this.position.z = siguientePunto.z;
          this.puntoActual = siguientePunto;
        }

        return colisiona;
      }
  }
}

export { Proyectil }
