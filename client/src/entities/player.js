import * as th from "three";
//import {AnimationMixer} from "three/examples/jsm/animation/"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Entity } from "./entity.js";
import Component from "../components/component";
import { finite_state_machine } from "../components/finite-state-machine.js";
import { player_state } from "../components/player-state.js";
import robotf from "../assets/rock1.fbx";
import { CHARACTER_MODELS } from "../assets/models.mjs";
import { AnimationMixer, Scene, Vector3 } from "three";
import { useEffect } from "react";
import Punch from "../components/punch";

export class PlayerEntity extends Entity {
    constructor(params) {
        super();
        this.object3d;
        this.params = params;
        this.BCC = new BasicCharacterController(this.params);
        this._Init();
        // window.onkeydown(this.punch.bind(this))
    }

    punch(event) {
        if (event.keyCode === 32) {
            new Punch({radius: 5, speed: 50, mesh: this.BCC.target})
        }
    }

    _Init() {
        this.AddComponent(this.BCC);
        this.InitEntity();
        this.params.entitySystem.Add(this, "player");
    }
    setMixer(as) {
        this.params.setMixer(as);
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

export class BasicCharacterController extends Component {
    constructor(params) {
        super();
        this.params_ = params;
    }

    Init() {
        this.activeState = "RobotArmature|Robot_Running";
        this.group_ = new th.Group();
        this.animations_ = [];
        this.mixer;
        this.target;
        this.fsm = new CharacterFSM();
        this.LoadModels();

    }

    InitComponent() {
        this.Init();
        this._RegisterHandler("health.death", (m) => {
            this.OnDeath(m);
        });
        this._RegisterHandler("update.position", (m) => {
            this.OnUpdatePosition(m);
        });
        this._RegisterHandler("update.rotation", (m) => {
            this.OnUpdateRotation(m);
        });
    }

    OnUpdatePosition(msg) {
        this.group_.position.copy(msg.value);
    }

    OnUpdateRotation(msg) {
        this.group_.quaternion.copy(msg.value);
    }

    OnDeath(msg) {
        this.stateMachine_.SetState("death");
    }

    addPhysics() {
        this.params_.physicsHandler.addHitbox({
            _id: "player",
            mesh: this.target,
            type:this.params_.type,
            mass: 1,
            radius: this.params_.radius,
            segments: this.params_.segments,
            fixedRotation:true,
            height:this.params_.height,
            position: this.params_.position,
        });

    }

    LoadModels() {
        const loader = this.params_.entitySystem
            .Get("loader")
            .GetComponent("LoadController");
        loader.LoadFBX(undefined, robotf, (result) => {
            console.clear();
            console.log(result);
            result.scale.multiplyScalar(0.01);
            // let mixer = new th.AnimationMixer(result);
            // let animationAction = mixer.clipAction(
            //     result.animations.find(
            //         (element) => element.name == this.activeState
            //     )
            // );
            // result.animations.forEach((e) => {
            //     this.animations_.push(mixer.clipAction(e));
            // });
            // animationAction.play();
            this.target = result;
            // this.mixer = mixer;
            this.addPhysics();
            this.params_.scene.add(result);

            result.position.copy(new Vector3(0,100,5));
        });
        /* loader.LoadGLTF(undefined,
            robot,
            (result) => {
                let mixer = new th.AnimationMixer(result.scene);
                let animationAction = mixer.clipAction(result.animations.find(element => element.name == this.activeState));
                console.log(result);
                console.log(result.animations.find(element => element.name == this.activeState));
                animationAction.play();
                this.mixer = mixer;
                this.params_.scene.add(result.scene);
            }
        ); */
    }

    ChangeState(newState) {
        console.log(newState);
        console.log(this.animations_);
        this.activeState = newState;
        let animationAction = this.mixer.clipAction(this.animations_[5]._clip);
        animationAction.play();
        this.params_.scene.add(this.target);
        //LoadModels();
    }

    Update(timeDelta) {
        if(this.mixer){
            this.mixer.update(timeDelta)
        }
    }

}
