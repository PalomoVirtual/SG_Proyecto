
import * as THREE from '../libs/three.module.js'

const MINCOLISION = 5;

class Proyectil extends THREE.Object3D {
  constructor(escena, arma, masCercano) {
    super();

    var bulletMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 1, color: 0xd4af37});
    var bulletGeometry = new THREE.SphereGeometry(1, 200, 200);
    this.bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    this.bulletHitbox = new THREE.Sphere(new THREE.Vector3(this.bullet.position.x, this.bullet.position.y, this.bullet.position.z), 1);
    this.velocity = 0;
    this.clock = new THREE.Clock();
    this.escena = escena;
    this.arma = arma;
    this.objetoImpacto = masCercano;

    this.add(this.bullet);
    // this.add(this.bulletHitbox);
  }

  setTrayectoria(puntoImpacto, puntoOrigen){
    this.puntoActual = new THREE.Vector3(); 
    this.puntoActual = puntoOrigen;
    this.puntoImpacto = puntoImpacto;
    this.bulletHitbox.translate(this.puntoActual);
    this.trayectoria = new THREE.Vector3(puntoImpacto.x-puntoOrigen.x, puntoImpacto.y-puntoOrigen.y, puntoImpacto.z-puntoOrigen.z);
    this.trayectoriaNormalized = new THREE.Vector3().copy(this.trayectoria).normalize();
    this.longitudTrayectoria = Math.sqrt(Math.pow(this.trayectoria.x, 2) + Math.pow(this.trayectoria.y, 2) + Math.pow(this.trayectoria.z, 2));
  }

  getObjetoImpacto(){
    return this.objetoImpacto;
  }

  setIndices(indiceArray, indiceGrafo){
      this.indiceArray = indiceArray;
      this.indiceGrafo = indiceGrafo;
  }

  setIndiceArma(indice){
      this.indiceArma = indice;
  }

  destruir(){
    // this.escena.arrayBalas.splice(this.indiceArray, 1);
    // this.escena.remove(this);
    this.escena.borraBala(this);
    // this.arma.remove(this);
    this.bullet.geometry.dispose();
    this.bullet.material.dispose();
  }

  distancia(objeto, punto){
    Math.sqrt(Math.pow(punto.x-objeto.position.x, 2) + Math.pow(punto.y-objeto.position.y, 2) + Math.pow(punto.z-objeto.position.z, 2));
  }

  colisiona(siguientePunto){
    // console.log("primero");
    // console.log(vecUtil);
    // console.log("segundo");
    // console.log(vecUtil2);
    // for(var i=0; i<this.escena.hitboxes.length; i++){
    //   if(this.escena.hitboxes[i].isPlane){
    //     if(this.bulletHitbox.intersectsPlane(this.escena.hitboxes[i])){
    //       console.log("COLISION");
    //       return true;
    //     }
    //   }
    //   else if(this.escena.hitboxes[i].isBox3){
    //     if(this.bulletHitbox.intersectsBox(this.escena.hitboxes[i])){
    //       console.log("COLISION");
    //       return true;
    //     }
    //   }
    //   else{
    //     // for(var j=0; j<this.escena.hitboxes[i].length; j++){
    //     //   if(this.bulletHitbox.intersectsBox(this.escena.hitboxes[i][j])){
    //     //     console.log("COLISION jerarquico" + j);
    //     //     return true;
    //     //   }
    //     // }
    //   }
    // }

    var vecUtil = new THREE.Vector3(siguientePunto.x-this.puntoImpacto.x, siguientePunto.y-this.puntoImpacto.y, siguientePunto.z-this.puntoImpacto.z).normalize();
    var vecUtil2 = new THREE.Vector3(this.puntoActual.x-this.puntoImpacto.x, this.puntoActual.y-this.puntoImpacto.y, this.puntoActual.z-this.puntoImpacto.z).normalize();

    if((vecUtil.x > 0 && vecUtil2.x < 0) || (vecUtil.y > 0 && vecUtil2.y < 0) || (vecUtil.z > 0 && vecUtil2.z < 0) ){
      // console.log("Salto de colision");
      return true;
    }

    return false;
  }
  
  update () {
      if(this.velocity > 0){
        var incrementoPorcentual = this.clock.getDelta() * this.velocity / this.longitudTrayectoria;
        var siguientePunto = new THREE.Vector3(this.puntoActual.x + this.trayectoria.x*incrementoPorcentual, this.puntoActual.y + this.trayectoria.y*incrementoPorcentual,
            this.puntoActual.z + this.trayectoria.z*incrementoPorcentual);
        // console.log(this.bulletHitbox.center);
        var colisiona = this.colisiona(siguientePunto);
        if(!colisiona){
          // console.log(this.longitudTrayectoria);
          this.position.x = siguientePunto.x;
          this.position.y = siguientePunto.y;
          this.position.z = siguientePunto.z;
          this.bulletHitbox.translate(new THREE.Vector3(this.position.x-this.bulletHitbox.center.x, this.position.y-this.bulletHitbox.center.y, this.position.z-this.bulletHitbox.center.z));
          this.puntoActual = siguientePunto;
        }
        // else{
        //   this.destruir();
        // }

        return colisiona;
      }
  }
}

export { Proyectil }
