import * as th from "three";
//import {AnimationMixer} from "three/examples/jsm/animation/"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Entity } from "./entity.js";
import Component from "../components/component";
import { finite_state_machine } from "../components/finite-state-machine.js";
import { player_state } from "../components/player-state.js";
import robotf from "../assets/Robot.fbx";
import Punch from "../components/punch";
import { PlayerInput } from "../components/player-input";

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
            new Punch({ radius: 5, speed: 50, mesh: this.BCC.target });
        }
    }

    _Init() {
        this.AddComponent(this.BCC);
        this.AddComponent(this.playerInput);
        this.InitEntity();
        //this.params.entitySystem.Add(this, "player");
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
        this.state = "IDLE";
        this.params_ = params;
    }

    Init() {
        this.activeState = "RobotArmature|Robot_Running";
        this.group_ = new th.Group();
        this.animations_ = [];
        this.mixer;
        this.fbxGeo;
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
            type: "player",
            fixedRotation: true,
            position: this.params_.position,
        });
    }

    LoadModels() {
        const loader = this.Parent.Get("loader").GetComponent("LoadController");
        loader.LoadFBX(undefined, robotf, (result) => {
            console.log(result);
            result.scale.multiplyScalar(0.01);
            result.position.y = -1000000;
            let mixer = new th.AnimationMixer(result);
            let animationAction = mixer.clipAction(
                result.animations.find(
                    (element) => element.name == this.activeState
                )
            );
            result.animations.forEach((e) => {
                this.animations_.push(mixer.clipAction(e));
            });
            animationAction.play();
            this.target = result;
            this.mixer = mixer;
            this.addPhysics();
            this.params_.scene.add(result);
        });
    }

    ChangeState(newState) {
        this.activeState = newState;
        let animationAction = this.mixer.clipAction(this.animations_[5]._clip);
        animationAction.play();
        this.params_.scene.add(this.target);
    }

    Update(timeDelta) {
        if (this.mixer) {
            this.mixer.update(timeDelta);
        }
    }
}
