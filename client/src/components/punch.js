import * as three from "three";
import stoneImg from "../assets/StonePlatform.jpg";
import Component from "./component";
import { Vector3, Clock, Vector2 } from "three";
import { Vec3 } from "cannon-es";

export default class Punch extends Component {
    constructor(params) {
        super();
        this.params = params;
        this.clock = new Clock();
        if (params) {
            this.params = params;
            const punchGeo = new three.BoxGeometry(10, 10, 1);
            const texture = new three.TextureLoader().load(stoneImg);
            const platformMat = new three.MeshPhongMaterial({ map: texture });
            this.mesh = new three.Mesh(punchGeo, platformMat);
            // params.scene.add(this.mesh);
            this.clock.start();
            params.type = "sphere";
            let parentPosition = params.mesh.position;
            let parentAngle = params.physicsHandler.findObject("player").angle;
            this.mesh.quaternion.setFromAxisAngle(
                new Vec3(0, 1, 0),
                parentAngle
            );
            let vector = new Vector2(
                5 * Math.sin(parentAngle),
                5 * Math.cos(parentAngle)
            );
            console.log(vector);
            // let vector = new Vector2(6, 6).rotateAround(new Vector2(0, 0), -parentAngle);
            let newPosition = new Vector3(
                parentPosition.x + vector.x,
                parentPosition.y,
                parentPosition.z + vector.y
            );
            this.ball = params.physicsHandler.addHitbox({
                ...params,
                fixedRotation: true,
                width: 3,
                height: 3,
                depth: 0.5,
                type: "punch",
                _id: "playerpunch",
                mesh: this.mesh,
                mass: 50,
                position: newPosition,
            });
            this.ball.velocity.copy(
                new Vector3(vector.x * 50, 200, vector.y * 50)
            );
        }
    }
    Update(_) {
        super.Update(_);
        if (this.params && this.mesh && this.clock.getElapsedTime() > 0.05) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.params.physicsHandler.world.removeBody(this.ball);
        }
    }
}
