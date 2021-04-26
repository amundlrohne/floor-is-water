import * as three from "three";
import { Clock, Vector3 } from "three";
import Component from "./component";
import waterImg from "../assets/water.png";
export default class Water extends Component {
  constructor(params) {
    super();
    this.clock = new Clock();
    this.InitComponent(params);
    this.params = params;
    if (params) {
      const worldWidth = 128,
        worldDepth = 128;
      let texture = new three.TextureLoader().load(waterImg);

      texture.wrapS = texture.wrapT = three.RepeatWrapping;
      texture.repeat.set(10, 10);

      let geometry = new three.PlaneGeometry(
        1000,
        1000,
        worldWidth - 1,
        worldDepth - 1
      );
      geometry.rotateX(-Math.PI / 2);

      const position = geometry.attributes.position;

      position.usage = three.DynamicDrawUsage;

      for (let i = 0; i < position.count; i++) {
        const y = 10 * Math.sin(i / 2);
        position.setY(i, y);
      }

      this.material = new three.MeshBasicMaterial({
        color: 0x4ac0ff,
        map: texture,
      });

      this.mesh = new three.Mesh(geometry, this.material);
      this.mesh.geometry.needsUpdate = true;
      params.scene.add(this.mesh);
      params.physicsHandler.addHitbox({
        _id: "plane1",
        mesh: this.mesh,
        mass: 0,
        position: new Vector3(0, 0, 0),
        type: "plane",
        entitySystem: params.entitySystem,
      });
    }
  }

  SetParent(p) {
    super.SetParent(p);
    const position = this.Parent.Position;
    this.mesh.position.set(
      position.x,
      position.y + this.params.height,
      position.z
    );
  }

  Update(timeElapsed) {
    const time = this.clock.getElapsedTime() * 10;
    const position = this.mesh.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const y =
        (3 * Math.sin(i / 5 + (time + i) / 7)) / 5 + this.Parent.Position.y;
      position.setY(i, y);
    }

    this.params.physicsHandler
      .findObject("plane1")
      .position.copy(this.Parent.Position);

    position.needsUpdate = true;
  }
}
