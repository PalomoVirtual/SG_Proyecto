
import * as THREE from '../libs/three.module.js'

class Mirilla extends THREE.Object3D {
  constructor() {
    super();

    var lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
    var pointMaterial = new THREE.PointsMaterial({color: 0xff0000, size: 0.01});

    const points =[];
    points.push(new THREE.Vector3(1.5, 0, 0));
    points.push(new THREE.Vector3(1, 0, 0));
    points.push(new THREE.Vector3(0.5, 0, 0));

    const pointCoord = [];
    pointCoord.push(new THREE.Vector3(0, 0, 0)); 

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointGeometry = new THREE.BufferGeometry().setFromPoints(pointCoord);

    var point = new THREE.Points(pointGeometry, pointMaterial);
    var line = new THREE.Line(lineGeometry, lineMaterial);
    
    var line2 = line.clone(), line3 = line.clone(), line4 = line.clone();
    line2.rotation.z = Math.PI/2;
    line3.rotation.z = Math.PI;
    line4.rotation.z = -Math.PI/2;

    this.add(line);
    this.add(line2);
    this.add(line3);
    this.add(line4);
    this.add(point);
  }
  
  update () {
  }
}

export { Mirilla }
