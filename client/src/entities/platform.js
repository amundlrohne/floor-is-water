import {Entity} from "./entity";
import Platform from "../components/platform";

export default class PlatformEntity extends Entity {
    constructor(params) {
        super()
        if (params) {
            if (params.position) {
                this.SetPosition(params.position)
            }
            this.AddComponent(new Platform(params));
        }
    }
}
