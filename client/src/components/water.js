import * as three from "three";
import Component from "./component";
export default class Water extends Component {
  constructor(params) {
    super();
    this.InitComponent(params);
    this.params = params;
    if (params) {
      const worldWidth = 128,
        worldDepth = 128;
      //   let texture = new three.TextureLoader().load("../assets/water.jpg");

      //   texture.wrapS = texture.wrapT = three.RepeatWrapping;
      //   texture.repeat.set(5, 5);

      let geometry = new three.PlaneGeometry(
        20000,
        20000,
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
        color: 0x0044ff,
        // map: texture,
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
      const y = 5 * Math.sin(i / 5 + (time + i) / 7) + baseY;
      position.setY(i, y);
    }

    position.needsUpdate = true;
  }
}
