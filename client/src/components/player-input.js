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
                this.jump();
            }if(event.key === 'd') {
                this.run[0] += 1;
                this.accelerate()
            }if(event.key === 'w') {
                this.run[1] += 1;
                this.accelerate()
            }if(event.key === 'a') {
                this.run[0] += -1;
                this.accelerate()
            }if(event.key === 's') {
                this.run[1] += -1;
                this.accelerate()
            }
        });
        document.addEventListener("keyup", (event) => {
            if(event.key === 'd') {
                this.run[0] -= 1;
                this.accelerate()
            }if(event.key === 'w') {
                this.run[1] -= 1;
                this.accelerate()
            }if(event.key === 'a') {
                this.run[0] -= -1;
                this.accelerate()
            }if(event.key === 's') {
                this.run[1] -= -1;
                this.accelerate()
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

    accelerate() {
        if (this.run[0] < 0) {
            this.run[0] = Math.max(this.run[0], -1)
        } else {
            this.run[0] = Math.min(this.run[0], 1)
        }
        if (this.run[1] < 0) {
            this.run[1] = Math.max(this.run[1], -1)
        } else {
            this.run[1] = Math.min(this.run[1], 1)
        }
        this.Parent.params.physicsHandler.accelerate(this.run[0]*35, 35*this.run[1]);
    }

    handleMove(e) {
        let x = e.x ? (e.x/50)*35 : 0;
        let y = e.y ? (e.y/50)*35 : 0;
        this.Parent.params.physicsHandler.accelerate(x, y);
    }
}
