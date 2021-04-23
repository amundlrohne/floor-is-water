import * as th from "three";
//import {AnimationMixer} from "three/examples/jsm/animation/"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Entity } from "./entity.js";
import Component from "../components/component";
import { finite_state_machine } from "../components/finite-state-machine.js";
import { player_state } from "../components/player-state.js";
import robotf from "../assets/Robot.fbx";
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
            console.log(result);
            result.scale.multiplyScalar(0.01);
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

    Update(timeInSeconds) {
        if (!this.stateMachine_) {
            return;
        }

        const input = this.GetComponent("BasicCharacterControllerInput");
        this.stateMachine_.Update(timeInSeconds, input);

        if (this._mixer) {
            this._mixer.update(timeInSeconds);
        }

        // HARDCODED
        this.Broadcast({
            topic: "player.action",
            action: this.stateMachine_._currentState.Name,
        });

        const currentState = this.stateMachine_._currentState;
        if (
            currentState.Name != "walk" &&
            currentState.Name != "run" &&
            currentState.Name != "idle"
        ) {
            return;
        }

        const velocity = this.velocity_;
        const frameDecceleration = new th.Vector3(
            velocity.x * this.decceleration_.x,
            velocity.y * this.decceleration_.y,
            velocity.z * this.decceleration_.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z =
            Math.sign(frameDecceleration.z) *
            Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

        velocity.add(frameDecceleration);

        const controlObject = this.group_;
        const _Q = new th.Quaternion();
        const _A = new th.Vector3();
        const _R = controlObject.quaternion.clone();

        const acc = this.acceleration_.clone();
        if (input._keys.shift) {
            acc.multiplyScalar(2.0);
        }

        if (input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
        }
        if (input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
        }
        if (input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(
                _A,
                4.0 * Math.PI * timeInSeconds * this.acceleration_.y
            );
            _R.multiply(_Q);
        }
        if (input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(
                _A,
                4.0 * -Math.PI * timeInSeconds * this.acceleration_.y
            );
            _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const oldPosition = new th.Vector3();
        oldPosition.copy(controlObject.position);

        const forward = new th.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new th.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x * timeInSeconds);
        forward.multiplyScalar(velocity.z * timeInSeconds);

        const pos = controlObject.position.clone();
        pos.add(forward);
        pos.add(sideways);

        const collisions = this._FindIntersections(pos, oldPosition);
        if (collisions.length > 0) {
            return;
        }

        const terrain = this.FindEntity("terrain").GetComponent(
            "TerrainChunkManager"
        );
        pos.y = terrain.GetHeight(pos)[0];

        controlObject.position.copy(pos);

        this.Parent.SetPosition(controlObject.position);
        this.Parent.SetQuaternion(controlObject.quaternion);
    }
}
