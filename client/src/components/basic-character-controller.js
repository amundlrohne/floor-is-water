import * as th from "three";
import Component from "../components/component";
import robotGLB from "../assets/RobotExpressive.glb";

export class BasicCharacterController extends Component {
    constructor(position, physicsHandler, camera, scene) {
        super();
        this.position = position;
        this.physicsHandler = physicsHandler;
        this.camera = camera;
        this.scene = scene;
        console.log("BCC CONSTRUCTOR");
    }

    InitEntity() {
        console.log("BCC INIT ENTITY");
        this.activeState = "Idle";
        this.group_ = new th.Group();
        this.animations = [];
        this.mixer;
        this.target;
        this.LoadModels();
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
        console.log(this.Parent.Name);
        this.physicsHandler.addHitbox({
            _id: this.Parent.Name,
            mesh: this.target,
            type: this.Parent.Name == "player" ? "player" : "enemy",
            fixedRotation: true,
            position: this.position,
        });
        if (this.Parent.Name == "player") {
            this.physicsHandler.addTracking(this.camera, "player");
        }
        this.ChangeState("Idle");
    }

    LoadModels() {
        const loader = this.FindEntity("loader").GetComponent("LoadController");
        loader.LoadGLTF(undefined, robotGLB, (result) => {
            console.log("LOADER");
            this.animations = result.animations;
            this.target = result.scene;
            this.mixer = new th.AnimationMixer(this.target);
            this.mixer
                .clipAction(result.animations.find((e) => e.name == "Idle"))
                .play();
            this.scene.add(this.target);
            this.addPhysics();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key == "p") {
                this.ChangeState("Running");
            }
        });
    }

    ChangeState(newState) {
        if (this.activeState != newState) {
            this.activeState = newState;
            this.mixer
                .clipAction(this.animations.find((e) => e.name == newState))
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(0.5)
                .play();
        }
    }

    Update(timeDelta) {
        if (this.mixer) {
            this.mixer.update(timeDelta);
        }
    }
}
