import {Entity} from "./entity";
import {PlatformColumn, PlatformFloating} from "../components/platform";

export default class PlatformEntity extends Entity {
    constructor(params) {
        super()
        if (params) {
            this.params = params;
            switch (params.type) {
                case 'Power-Column':
                    params.name = "powercolumn"
                    this.AddComponent(new PlatformColumn(params));
                    break;
                case 'Column':
                    params.name = "column"
                    this.AddComponent(new PlatformColumn(params));
                    break;
                case 'Floating':
                    params.name = "floating"
                    this.AddComponent(new PlatformFloating(params));
                    break;
                case 'Final':
                    break;
            }
        }
    }

}
