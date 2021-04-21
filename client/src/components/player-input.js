import Component from "../components/component";
import EntitySystem from "../systems/entity-system";
import * as th from "three";
import { Vector3 } from "three";

export class PlayerInput extends Component {
    constructor(params) {
        super();
        this.keysPressed = { w: false, a: false, s: false, d: false };
        this.Init();
    }

    Init() {
        //this.physHandler = this.Parent.params.physicsHandler;
        //unnnecccesasyr
        this.addMovement();
    }
    addMovement() {
        //MUST BE SWITCHED WITH TOUCH UI ELEMENTS
        //console.log(this.Parent.params.physicsHandler)

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
                console.log("SPACE");
                this.keysPressed[event.code] == true;
            }
        });

        document.addEventListener("keyup", (event) => {
            let num = 0;
/*             Object.keys(this.keysPressed).forEach((e) => {
                if (this.keysPressed[e] == true) {
                    num += 1;
                    console.log(e)
                }
            });
            console.log(event.key + "HER");
            if(event.code!="Space"){
            this.keysPressed[event.key] = false;}else{this.keysPressed[event.code] = false;}
            if ((num = 1)) {
                console.log("STOP");
            } */
            if(event.code!="Space"){
                this.keysPressed[event.key] = false;}else{this.keysPressed[event.code] = false;}
            num = 0;
            /* if (event.key == "w"||event.key == "s") {
                console.log("STOPWS")
                this.Parent.params.physicsHandler.applyVelocity(
                    "player",
                    new Vector3(0, 0, -1*(this.Parent.params.physicsHandler.findObject("player").velocity.z+10))
                );
            } */
            if (event.key == "a"||event.key =="d"||event.key == "w"||event.key == "s") {
                console.log("STOPAD")
                this.Parent.params.physicsHandler.stopVelocity("player")
                setTimeout(() => { this.Parent.params.physicsHandler.extraStopVelocity("player") }, 50);
                setTimeout(() => { this.Parent.params.physicsHandler.extraStopVelocity("player") }, 100);
                /* this.Parent.params.physicsHandler.applyVelocity(
                    "player",
                    new Vector3(-1*(this.Parent.params.physicsHandler.findObject("player").velocity.x+10), 0, 0)
                ); */
            }
            console.log("STOP")
        });
        document.addEventListener("keydown", (e) => {
            console.log(this.keysPressed);
            if (this.keysPressed["w"] == true) {
                if (
                    this.Parent.params.physicsHandler.findObject("player")
                        .velocity.z > -10
                ) {
                    this.Parent.params.physicsHandler.applyVelocity(
                        "player",
                        new Vector3(0, 0, -10)
                    );
                }
            }
            if (this.keysPressed["a"] == true) {
                if (
                    this.Parent.params.physicsHandler.findObject("player")
                        .velocity.x > -10
                ) {
                    this.Parent.params.physicsHandler.applyVelocity(
                        "player",
                        new Vector3(-10, 0, 0)
                    );
                }
            }
            if (this.keysPressed["s"] == true) {
                if (
                    this.Parent.params.physicsHandler.findObject("player")
                        .velocity.z < 10
                ) {
                    this.Parent.params.physicsHandler.applyVelocity(
                        "player",
                        new Vector3(0, 0, 10)
                    );
                }
            }
            if (this.keysPressed["d"] == true) {
                if (
                    this.Parent.params.physicsHandler.findObject("player")
                        .velocity.x < 10
                ) {
                    this.Parent.params.physicsHandler.applyVelocity(
                        "player",
                        new Vector3(10, 0, 0)
                    );
                }
            }
            if (this.keysPressed["Space"] == true) {
                if (
                    this.Parent.params.physicsHandler.findObject("player")
                        .velocity.y < 0.1
                ) {
                    this.Parent.params.physicsHandler.applyVelocity(
                        "player",
                        new Vector3(0, 50, 0)
                    );
                }
            }
            if (this.keysPressed["p"] == true) {
                if (
                    this.Parent.params.physicsHandler.findObject("player")
                        .velocity.y < 0.1
                ) {
                    this.Parent.params.physicsHandler.stopVelocity("player");
                }
            }
        });
    }
}
