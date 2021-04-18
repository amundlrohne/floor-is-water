import Component from "./component";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import pallete from "../assets/PalleteTex.png";
import * as three from "three";

export default class Powerup extends Component {
  constructor(params) {
    super();
    this.InitComponent(params);
    this.params = params;
    if (params) {
      const loader = new FBXLoader();
      loader.load(params.model, function (result) {
        result.position.copy(params.position);

        let map = new three.TextureLoader().load(pallete);
        map.encoding = three.sRGBEncoding;

        let mesh = result.children[0];
        mesh.material = new three.MeshPhongMaterial({
          map: map,
          color: 0xff00ff,
        });

        mesh.scale.setScalar(5);
        mesh.traverse((c) => {
          c.castShadow = true;
        });

        mesh.position.copy(params.position);

        params.scene.add(mesh);
      });
    }
  }
}
