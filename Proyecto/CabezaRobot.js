
import * as THREE from '../libs/three.module.js'

class CabezaRobot extends THREE.Object3D {
  constructor() {
    super();
    this.anchuraCabeza = 50;
    this.anchuraBoca = 30;
    this.radioOjo = 9/2;
    this.radioOreja = 11/2;
    this.longitudOreja = 40;
    this.alturaAntena = 10;
    this.offsetBocaY = 10;
    this.offsetBocaZ = this.anchuraCabeza/2 - 3;
    this.offsetOjosX = this.radioOjo*2;
    this.offsetOjosY = this.offsetBocaY;
    this.offsetOjosZ = this.anchuraCabeza/2;
    this.offsetOreja = this.anchuraCabeza/2 + this.longitudOreja/2;
    this.offsetAntenaX = 13;
    this.offsetAntenaY = this.anchuraCabeza/2 + this.alturaAntena/4;
    this.gradosCabeza = 0;
    

    var geometryBase = new THREE.BoxGeometry(this.anchuraCabeza, this.anchuraCabeza, this.anchuraCabeza);
    var materialBase = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xB0B3B7})
    var base = new THREE.Mesh(geometryBase, materialBase);
    base.rotation.y = this.gradosCabeza;

    var geometryBoca = new THREE.BoxGeometry(this.anchuraBoca, this.anchuraBoca/3, this.anchuraBoca/3);
    var materialBoca = new THREE.MeshStandardMaterial({metalness: 0.6, roughness: 0, color: 0xd4af37});
    geometryBoca.translate(0, -this.offsetBocaY, this.offsetBocaZ);
    var boca = new THREE.Mesh(geometryBoca, materialBoca);
    boca.rotation.y = this.gradosCabeza;
    
    var materialOjo = new THREE.MeshStandardMaterial({metalness: 0.6, roughness: 0, color: 0xd4af37});
    
    var geometryOjo1 = new THREE.SphereGeometry(this.radioOjo, 50, 50);
    geometryOjo1.translate(-this.offsetOjosX, this.offsetOjosY, this.offsetOjosZ);
    var ojo1 = new THREE.Mesh(geometryOjo1, materialOjo);
    ojo1.rotation.y = this.gradosCabeza;
    
    var geometryOjo2 = new THREE.SphereGeometry(this.radioOjo, 50, 50);
    geometryOjo2.translate(this.offsetOjosX, this.offsetOjosY, this.offsetOjosZ);
    var ojo2 = new THREE.Mesh(geometryOjo2, materialOjo);
    ojo2.rotation.y = this.gradosCabeza;
    
    var materialOreja = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616});
    
    var geometryOreja1 = new THREE.ConeGeometry(this.radioOreja, this.longitudOreja, 50, 50);
    geometryOreja1.rotateZ(Math.PI/2);
    geometryOreja1.translate(-this.offsetOreja, 0, 0);
    var oreja1 = new THREE.Mesh(geometryOreja1, materialOreja);
    oreja1.rotation.y = this.gradosCabeza;
    
    var geometryOreja2 = new THREE.ConeGeometry(this.radioOreja, this.longitudOreja, 50, 50);
    geometryOreja2.rotateZ(-Math.PI/2);
    geometryOreja2.translate(this.offsetOreja, 0, 0);
    var oreja2 = new THREE.Mesh(geometryOreja2, materialOreja);
    oreja2.rotation.y = this.gradosCabeza;
    
    var materialAntena = new THREE.MeshStandardMaterial({metalness: 0.7, roughness: 0, color: 0xC61616});
    
    var geometryAntena1 = new THREE.TetrahedronGeometry(this.alturaAntena/4);
    geometryAntena1.translate(-this.offsetAntenaX, this.offsetAntenaY, 0);
    var antena1 = new THREE.Mesh(geometryAntena1, materialAntena);
    antena1.rotation.y = this.gradosCabeza;

    var geometryAntena2 = new THREE.TetrahedronGeometry(this.alturaAntena/4);
    geometryAntena2.translate(this.offsetAntenaX, this.offsetAntenaY, 0);
    var antena2 = new THREE.Mesh(geometryAntena2, materialAntena);
    antena2.rotation.y = this.gradosCabeza;

    this.add(base);
    this.add(boca);
    this.add(ojo1);
    this.add(ojo2);
    this.add(oreja1);
    this.add(oreja2);
    this.add(antena1);
    this.add(antena2);
  }
  
  getAnchura(){
      return this.anchuraCabeza;
  }
  
  update () {
  }
}

export { CabezaRobot }
