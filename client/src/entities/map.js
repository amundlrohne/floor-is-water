import { Entity } from "./entity";
import Map from "../components/map";
import PlatformEntity from "./platform";
import WaterEntity from "./water";

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
      const water = new WaterEntity({ scene: params.scene, height: 5 });
    }
  }
}
