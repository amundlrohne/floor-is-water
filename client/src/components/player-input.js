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
        //this.physHandler = this.Parent.params.physicsHandler;
        //unnnecccesasyr
        this.addMovement();
    }
    addMovement() {
        //MUST BE SWITCHED WITH TOUCH UI ELEMENTS
        //console.log(this.Parent.params.physicsHandler)
        document.addEventListener("keydown", (e) => {
            if(e.key=="w"){
                if(this.Parent.params.physicsHandler.findObject('player').velocity.z > -20) {
                    this.Parent.params.physicsHandler.applyVelocity("player",new Vector3(0 ,0,-30))
                }
            }
            if(e.key=="a"){
                if(this.Parent.params.physicsHandler.findObject('player').velocity.x > -20) {
                    this.Parent.params.physicsHandler.applyVelocity("player",new Vector3(-30,0,0))
                }
            }
            if(e.key=="s"){
                if(this.Parent.params.physicsHandler.findObject('player').velocity.z < 20) {
                    this.Parent.params.physicsHandler.applyVelocity("player",new Vector3(0,0,30))
                }
            }
            if(e.key=="d"){
                if(this.Parent.params.physicsHandler.findObject('player').velocity.x < 20) {
                    this.Parent.params.physicsHandler.applyVelocity("player",new Vector3(30,0,0))
                }
            }
            if(e.code=="Space"){
                if(this.Parent.params.physicsHandler.findObject('player').velocity.y < 50) {
                    this.Parent.params.physicsHandler.applyVelocity("player",new Vector3(0,30,0))
                }
            }
        });
    }
}
