import {Entity} from "./entity";
import {PlatformColumn, PlatformFloating} from "../components/platform";

export default class PlatformEntity extends Entity {
    constructor(params) {
        super()
        if (params) {
            this.params = params;
            switch (params.type) {
                case 'Column':
                    this.AddComponent(new PlatformColumn(params));
                    break;
                case 'Floating':
                    this.AddComponent(new PlatformFloating(params));
                    break;
                case 'Final':
                    break;
            }
        }
    }

}
