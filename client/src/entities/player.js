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
import {PlayerInput} from "../components/player-input";
import { LoadController } from "../components/load-controller.js";

export class PlayerEntity extends Entity {
    constructor(params) {
        super();
        this.object3d;
        this.params = params;
        this.BCC = new BasicCharacterController(this.params);
        this.playerInput = new PlayerInput(this.params);
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
        this.AddComponent(this.playerInput);
        this.InitEntity();
        this.params.entitySystem.Add(this, "player");
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
        this.activeState = "Idle";
        this.group_ = new th.Group();
        this.animations = [];
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
            type: 'player',
            fixedRotation:true,
            position: this.params_.position,
        });
        this.params_.physicsHandler.addTracking(this.Parent.params.camera, 'player');
    }

    LoadModels() {
        const loader = this.params_.entitySystem
            .Get("loader")
            .GetComponent("LoadController");
        loader.LoadGLTF(undefined,robotGLB,(result)=>{
            console.log(result.animations.find(e=>e.name=="Idle"), result.animations[0]);
            this.animations = result.animations;
            this.target = result.scene;
            this.mixer = new th.AnimationMixer(this.target);
	        this.mixer.clipAction(result.animations.find(e=>e.name=="Idle")).play();
            this.params_.scene.add(this.target);
            this.addPhysics();
        })
        document.addEventListener("keydown",(e)=>{if(e.key=="p"){this.ChangeState("Running")}})
    }

    ChangeState(newState) {
        if(this.activeState!=newState){
        this.state=newState;
        this.mixer.clipAction(this.animations.find(e=>e.name==newState)).reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( 0.5 ).play();
    }}

    Update(timeDelta) {
        if(this.mixer){
            this.mixer.update(timeDelta)
        }
    }

}
