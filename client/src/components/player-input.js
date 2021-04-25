import Component from "../components/component";
import EntitySystem from "../systems/entity-system";
import * as th from "three";
import { Vector3 } from "three";

export class PlayerInput extends Component {
    constructor(params) {
        super();
        this.run = [0, 0];
        this.keysPressed = {
            w: false,
            a: false,
            s: false,
            d: false,
            Space: false,
        };
        this.jumpReady = true;
        this.Init();

    }

    Init() {
        this.addMovement();
    }
    addMovement() {
        //
        //
        document.addEventListener("keydown", (event) => {
            if(event.key === 'k') {
                this.Parent.params.physicsHandler.addTracking(this.Parent.params.camera, 'player')
            }if(event.keyCode === 32) {
                this.jump()
            }
        });
    }
    keyDown(e){
    };

    jump() {
        this.Parent.params.physicsHandler.playerJump(
            "player",
        );
    }

    handleMove(e) {
        let x = e.x ? (e.x/50)*35 : 0;
        let y = e.y ? (e.y/50)*35 : 0;
        this.Parent.params.physicsHandler.accelerate(x, y);
    }
}
