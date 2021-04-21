import Component from "../components/component";
import EntitySystem from "../systems/entity-system";
import * as th from "three";
import { Vector3 } from "three";

export class PlayerInput extends Component {
    constructor(params) {
        super();
        this.Init();
    }

    Init() {
        this.addMovement();
    }
    addMovement() {
        console.log("KJØRR");
        //MUST BE SWITCHED WITH TOUCH UI ELEMENTS
        document.addEventListener("keydown", (e) => {
            console.log(this.parent_.Position);
            this.parent_.SetPosition(new Vector3(0, this.parent_.Position.y+1, 0));
        });
    }
}
