import Component from "./component";
import * as THREE from "three";

export class NetworkEntityComponent extends Component {
    constructor(physicsHandler) {
        super();
        this.transformUpdates_ = [];
        this.targetFrame_ = null;
        this.lastFrame_ = null;
        this.lastUpdate_ = 0.0;
        this.physicsHandler = physicsHandler;
        this.activeState = "Idle";
    }

    InitComponent() {
        this._RegisterHandler("network.update", (m) => {
            this.OnNetworkUpdate_(m);
        });
    }

    SetTransform_(transform) {
        this.physicsHandler.setPosition(
            this.Parent.Name,
            new THREE.Vector3(...transform[1])
        );
        this.physicsHandler.setQuaternion(
            this.Parent.Name,
            new THREE.Quaternion(...transform[2])
        );
        this.targetFrame_ = { time: 0.1, transform: transform };
    }

    OnNetworkUpdate_(msg) {
        if ("transform" in msg) {
            this.lastUpdate_ = 0.0;
            this.transformUpdates_.push({
                time: 0.1,
                transform: msg.transform,
            });

            this.activeState = msg.transform[0];

            // First update
            if (this.targetFrame_ == null) {
                this.SetTransform_(msg.transform);
            }
        }
    }

    Update(timeElapsed) {
        this.GetComponent("BasicCharacterController").ChangeState(
            this.activeState
        );
        this.lastUpdate_ += timeElapsed;
        if (this.lastUpdate_ >= 10.0) {
            this.parent_.SetDead();
        }

        if (this.transformUpdates_.length == 0) {
            return;
        }

        for (let i = 0; i < this.transformUpdates_.length; ++i) {
            this.transformUpdates_[i].time -= timeElapsed;
        }

        while (
            this.transformUpdates_.length > 0 &&
            this.transformUpdates_[0].time <= 0.0
        ) {
            this.lastFrame_ = {
                transform: [
                    this.targetFrame_.transform[0],
                    this.physicsHandler
                        .findObject(this.Parent.Name)
                        .position.toArray(),
                    this.physicsHandler
                        .findObject(this.Parent.Name)
                        .quaternion.toArray(),
                ],
            };
            this.targetFrame_ = this.transformUpdates_.shift();
            this.targetFrame_.time = 0.0;
        }

        if (this.targetFrame_ && this.lastFrame_) {
            this.targetFrame_.time += timeElapsed;
            const p1 = new THREE.Vector3(...this.lastFrame_.transform[1]);
            const p2 = new THREE.Vector3(...this.targetFrame_.transform[1]);
            const q1 = new THREE.Quaternion(...this.lastFrame_.transform[2]);
            const q2 = new THREE.Quaternion(...this.targetFrame_.transform[2]);
            const pf = new THREE.Vector3();
            const qf = new THREE.Quaternion();
            pf.copy(p1);
            qf.copy(q1);

            const t = Math.max(
                Math.min(this.targetFrame_.time / 0.1, 1.0),
                0.0
            );
            pf.lerp(p2, t);
            qf.slerp(q2, t);

            this.physicsHandler.setPosition(this.Parent.Name, pf);
            this.physicsHandler.setQuaternion(this.Parent.Name, qf);
        }
    }
}
