import Component from "./component";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import pallete from "../assets/PalleteTex.png";
import * as three from "three";

import gem4 from "../assets/gem4.fbx";
import gem1 from "../assets/gem1.fbx";
import gem7 from "../assets/gem7.fbx";
import gem5 from "../assets/gem5.fbx";

export default class Powerup extends Component {
  constructor(params) {
    super();
    this.InitComponent(params);
    this.params = params;
    this.mesh;
    this.uuid = "";
    this.startY = params.position.y;
    if (params) {
      const loader = new FBXLoader();

      switch (params.type) {
        case "speed":
          loader.load(gem1, (result) => {
            this.loadModel(result);
          });
          break;
        case "shield":
          loader.load(gem7, (result) => {
            this.loadModel(result);
          });
          break;
        case "punch":
          loader.load(gem4, (result) => {
            this.loadModel(result);
          });
          break;
        case "jump":
          loader.load(gem5, (result) => {
            this.loadModel(result)
          })
      }
    }
  }
  loadModel(result) {
    result.position.copy(this.params.position);

    let map = new three.TextureLoader().load(pallete);
    map.encoding = three.sRGBEncoding;

    this.mesh = result.children[0];
    this.uuid = this.mesh.uuid;
    this.mesh.material = new three.MeshPhongMaterial({
      map: map,
      // color: 0xff00ff,
    });

    this.mesh.scale.setScalar(5);
    this.mesh.traverse((c) => {
      c.castShadow = true;
    });

    this.mesh.position.copy(this.params.position);

    this.params.scene.add(this.mesh);
  }

  update(clock) {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * 10;
    if (this.mesh) {
      const position = this.mesh.position;

      const y =
        (3 * Math.sin(position.y + (time + position.y) / 4)) / 5 + this.startY;
      position.setY(y);

      this.mesh.rotation.y -= 0.05;

      position.needsUpdate = true;
    }
  }
}
