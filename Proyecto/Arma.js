
import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class Arma extends THREE.Object3D {
  constructor() {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la grapadora
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    // this.createGUI(gui,titleGui);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../models/Proyecto/fusil/fusil.mtl',
        (materials) => {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/Proyecto/fusil/fusil.obj',
            (object) => {
                this.add(object);
            }, null, null);
        });
  }

  hayBalas(){
      return this.children.length > 1;
  }
  
  update () {
      if(this.hayBalas()){
        for(var i = 1; i<this.children.length; i++){
            this.children[i].update();
        }
      }
    // No hay nada que actualizar ya que la apertura de la grapadora se ha actualizado desde la interfaz
  }
}

export { Arma }
