import { Entity } from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import WaterEntity from "./water";
import PowerupEntity from "./power-up";
import { Vector3 } from "three";
import gem4 from "../assets/gem4.fbx";

export default class MapEntity extends Entity {
  constructor(params) {
    super();
    if (params) {
      if (params.position) {
        this.SetPosition(params.position);
      }
      this.AddComponent(new Map({ scene: params.scene }));
      const platform = new PlatformEntity({
        scene: params.scene,
        radius: 5,
        height: 20,
        segments: 6,
      });
      const powerup = new PowerupEntity({
        scene: params.scene,
        type: "speed",
        position: new Vector3(0, 30, 0),
        model: gem4,
      });
      this.water = new WaterEntity({ scene: params.scene, height: 5 });
    }
  }

  updateWater(clock, baseY) {
    // console.log(clock);
    this.water.update(clock, baseY);
  }
}
