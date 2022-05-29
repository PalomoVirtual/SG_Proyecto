
import * as THREE from '../libs/three.module.js'

const clock = new THREE.Clock();
const MINCOLISION = 5;

class Proyectil extends THREE.Object3D {
  constructor(escena, arma) {
    super();

    var bulletMaterial = new THREE.MeshStandardMaterial({roughness: 0.5, metalness: 1, color: 0xd4af37});
    var bulletGeometry = new THREE.SphereGeometry(1, 200, 200);
    var bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    this.velocity = 0;

    this.escena = escena;
    this.arma = arma;
    this.add(bullet);
  }

  setTrayectoria(puntoImpacto, puntoOrigen){
    this.puntoActual = new THREE.Vector3; 
    this.puntoActual = puntoOrigen;
    this.trayectoria = new THREE.Vector3(puntoImpacto.x-puntoOrigen.x, puntoImpacto.y-puntoOrigen.y, puntoImpacto.z-puntoOrigen.z)
  }

  setIndices(indiceArray, indiceGrafo){
      this.indiceArray = indiceArray;
      this.indiceGrafo = indiceGrafo;
  }

  setIndiceArma(indice){
      this.indiceArma = indice;
  }

  destruir(){
    this.escena.arrayBalas.splice(indice, 1);
    this.escena.remove(this);
    this.arma.remove(this);
  }

  distancia(objeto, punto){
    Math.sqrt(Math.pow(punto.x-objeto.position.x, 2), Math.pow(punto.y-objeto.position.y, 2), Math.pow(punto.z-objeto.position.z, 2));
  }

  colisiona(siguientePunto){
      for(var i=0; i<this.escena.alineables.length; i++){
        var dist = this.distancia(this.escena.alineables[i], siguientePunto);  
        console.log(this.escena.alineables[i]);
        if(dist < MINCOLISION){
            console.log("COLISION");
            return true;
        }
      }
      return false;
  }
  
  update () {
      if(this.velocity > 0){
        var longitudTrayectoria = Math.sqrt(Math.pow(this.trayectoria.x, 2), Math.pow(this.trayectoria.y, 2), Math.pow(this.trayectoria.z, 2));
        var incrementoPorcentual = clock.getDelta() * this.velocity / longitudTrayectoria;
        var siguientePunto = new THREE.Vector3(this.puntoActual.x + this.trayectoria.x*incrementoPorcentual, this.puntoActual.y + this.trayectoria.y*incrementoPorcentual,
            this.puntoActual.z + this.trayectoria.z*incrementoPorcentual);
        if(!this.colisiona(siguientePunto)){
            this.position.x = siguientePunto.x;
            this.position.y = siguientePunto.y;
            this.position.z = siguientePunto.z;
            this.puntoActual = siguientePunto;
        }
        else{
            destruir();
        }

      }
  }
}

export { Proyectil }
