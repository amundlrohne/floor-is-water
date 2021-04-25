import * as three from "three";
import stoneImg from "../assets/stonePlatform.jpg";
import Component from "./component";
import {Vector3, Clock} from "three";

export default class Punch extends Component {
    constructor(params) {
        super();
        this.params = params;
        this.clock = new Clock();
        if (params) {
            this.params = params;
            const punchGeo = new three.SphereGeometry(params.radius);
            const texture = new three.TextureLoader().load(stoneImg);
            const platformMat = new three.MeshPhongMaterial({map: texture});
            this.mesh = new three.Mesh(punchGeo, platformMat);
            params.scene.add(this.mesh);
            this.clock.start();
            params.type = 'sphere';
            params.physicsHandler.addHitbox({...params, type: 'sphere', _id: 'playerpunch', mesh: this.mesh, mass: 50, position: new Vector3(params.mesh.position.x, params.mesh.position.y+1, params.mesh.position.z)})
        }
    }
    Update(_) {
        super.Update(_);
        if (this.params && this.mesh && this.clock.getElapsedTime() > 1) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.params.scene.remove(this.mesh);
        }
    }
}
