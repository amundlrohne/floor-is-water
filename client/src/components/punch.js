import * as three from "three";
import stoneImg from "../assets/stonePlatform.jpg";
import Component from "./component";
import {Vector3} from "three";

export default class Punch extends Component {
    constructor(params) {
        super();
        this.params = params;
        if (params) {
            const punchGeo = new three.SphereGeometry(params.radius);
            const texture = new three.TextureLoader().load(stoneImg);
            const platformMat = new three.MeshPhongMaterial({map: texture});
            this.mesh = new three.Mesh(punchGeo, platformMat);
            params.scene.add(this.mesh);
            params.type = 'sphere';
            params.physicsHandler.addHitbox({_id: 'playerpunch', mesh: this.mesh, mass: 50, ...params, position: new Vector3(params.mesh.position.x, params.mesh.position.y+1, params.mesh.position.z)})
        }
    }
}
