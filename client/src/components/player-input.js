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


        document.addEventListener("keyup", (event) => {
            if (event.code == "Space") {
                this.keysPressed[event.code] = false;
            } else {
                this.keysPressed[event.key] = false;
            }

            if (event.key == "w") {
                this.run[1] = 0;
            }
            if (event.key == "s") {
                this.run[1] = 0;
            }
            if (event.key == "a") {
                this.run[0] = 0;
            }
            if (event.key == "d") {
                this.run[0] = 0;
            }
            this.Parent.params.physicsHandler.stopVelocity(
                "player",
                this.run[0],
                this.run[1]
            );
            this.Parent.params.physicsHandler.accelerate(
                this.run[0],
                this.run[1]
            );
            this.keyDown(event);
        });
        document.addEventListener("keydown", (event) => {
            if (
                event.key == "w" ||
                event.key == "a" ||
                event.key == "s" ||
                event.key == "d" ||
                event.key == "p"
            )
                this.keysPressed[event.key] = true;
            if (event.code == "Space") {
                this.keysPressed[event.code] = true;
            }
            this.keyDown(event);
        });
    }
    keyDown(e){
        
        if (this.keysPressed["w"]) {
            this.run[1] = -2;
        }
        if (this.keysPressed["s"]) {
            this.run[1] = 2;
        }
        if (this.keysPressed["a"]) {
            this.run[0] = -2;
        }
        if (this.keysPressed["d"]) {
            this.run[0] = 2;
        }
        this.Parent.params.physicsHandler.accelerate(
            this.run[0],
            this.run[1]
        );

        if (this.keysPressed["Space"] == true) {
            {
                this.Parent.params.physicsHandler.playerJump(
                    "player",
                );
                this.Parent.params.entitySystem.Get("player")._rotation.y=50;
            }
        }
    };
}
