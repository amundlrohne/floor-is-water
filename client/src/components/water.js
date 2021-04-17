import * as three from "three";
import Component from "./component";
import waterImg from "../assets/water.png";
export default class Water extends Component {
  constructor(params) {
    super();
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
        color: 0xa6e0ff,
        map: texture,
      });

      this.mesh = new three.Mesh(geometry, this.material);
      this.mesh.geometry.needsUpdate = true;
      params.scene.add(this.mesh);
    }
  }

  SetParent(p) {
    super.SetParent(p);
    const position = this.Parent.Position;
    console.log(position);
    this.mesh.position.set(
      position.x,
      position.y + this.params.height,
      position.z
    );
  }

  update(clock, baseY) {
    const delta = clock.getDelta();
    const time = clock.getElapsedTime() * 10;
    console.log(this.mesh);
    const position = this.mesh.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const y = (3 * Math.sin(i / 5 + (time + i) / 7)) / 5 + baseY;
      position.setY(i, y);
    }

    position.needsUpdate = true;
  }
}
