import * as three from "three";
import Component from "./component";
import water from "../assets/water.jpg";
import { Vector3 } from "three";
export default class Map extends Component {
    constructor(params) {
        super();
        this.InitComponent(params);
        if (params) {
            {//Add a plane
                const planeGeo = new three.PlaneGeometry(1000, 1000);
                const texture = new three.TextureLoader().load(water);
                const planeMat = new three.MeshPhongMaterial({
                    bumpMap: texture,
                    color: "#8AC",
                });
                this.mesh = new three.Mesh(planeGeo, planeMat);
                this.mesh.rotation.x = Math.PI * -0.5;
                params.scene.add(this.mesh);
                params.physicsHandler.addHitbox({
                    _id: "plane1",
                    mesh: this.mesh,
                    mass: 0,
                    position: new Vector3(0, 0, 0),
                    type: "plane",
                });
            }
        }
    }

    SetParent(p) {
        super.SetParent(p);
        this.UpdatePosition();
    }

    UpdatePosition() {
        const position = this.Parent.Position;
        this.mesh.position.copy(position);
    }
}
