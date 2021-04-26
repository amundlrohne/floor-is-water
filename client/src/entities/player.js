import * as th from "three";
//import {AnimationMixer} from "three/examples/jsm/animation/"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Entity } from "./entity.js";
import Component from "../components/component";
import { finite_state_machine } from "../components/finite-state-machine.js";
import { player_state } from "../components/player-state.js";
import robotf from "../assets/Robot.fbx";
import robotGLB from "../assets/RobotExpressive.glb";
import Punch from "../components/punch";
import rockTexture from "../assets/stonePlatform.jpg";
import { PlayerInput } from "../components/player-input";
import { LoadController } from "../components/load-controller.js";

export class PlayerEntity extends Entity {
    constructor(params) {
        super();
        this.params = params;
        this.BCC = new BasicCharacterController(this.params);
        this.playerInput = new PlayerInput(this.params);
        this.clock = new th.Clock();
        this.lastPunch = this.clock.getElapsedTime();
        
        // window.onkeydown(this.punch.bind(this))
    }

    punch() {
        if (this.clock.getElapsedTime() - this.lastPunch > 3) {
            this.AddComponent(
                new Punch({
                    ...this.params,
                    radius: 5,
                    speed: 50,
                    mesh: this.BCC.target,
                })
            );
            this.lastPunch = this.clock.getElapsedTime();
        }
    }

    InitEntity() {
        this.AddComponent(this.BCC);
        this.AddComponent(this.playerInput);
        console.log("PLAYER INIT ENTITY");
        //this.InitEntity();
        //this.params.entitySystem.Add(this, "player");
    }
}

export class CharacterFSM extends finite_state_machine.FiniteStateMachine {
    constructor(proxy) {
        super();
        this._proxy = proxy;
        this.Init_();
    }

    Init_() {
        this._AddState("idle", player_state.IdleState);
        this._AddState("jump", player_state.JumpState);
        this._AddState("run", player_state.RunState);
        this._AddState("attack", player_state.AttackState);
        this._AddState("death", player_state.DeathState);
    }
}

export class BasicCharacterControllerProxy {
    constructor(animations) {
        this.animations_ = animations;
    }

    get animations() {
        return this.animations_;
    }
}


