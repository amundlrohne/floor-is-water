import { Entity } from "./entity";
import Water from "../components/water";

export default class WaterEntity extends Entity {
  constructor(params) {
    super();
    if (params) {
      if (params.position) {
        this.SetPosition(params.position);
      }
      this.AddComponent(new Water(params));
    }
  }
}
