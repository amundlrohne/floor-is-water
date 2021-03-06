import Component from "./component";

export class NetworkPlayerComponent extends Component {
    constructor() {
        super();
        this.updateTimer_ = 0.0;
        this.loaded_ = true;
    }

    InitComponent() {
        this._RegisterHandler("network.update", (m) => {
            this.OnUpdate_(m);
        });
    }

    InitEntity() {
        this.net_ = this.FindEntity("network").GetComponent("NetworkComponent");
    }

    OnActionAttack_(msg) {
        this.net_.SendActionAttack_();
    }

    OnUpdate_(transform) {
        if (transform) {
            this.Parent.SetPosition(new THREE.Vector3(...msg.transform[1]));
            this.Parent.SetQuaternion(
                new THREE.Quaternion(...msg.transform[2])
            );
        }
    }

    OnLoaded_(_) {
        this.loaded_ = true;
    }

    CreateTransformPacket() {
        const controller = this.GetComponent("BasicCharacterController");

        return [
            controller.activeState, //TODO: Proper state handling
            this.Parent.Position.toArray(),
            this.Parent.Quaternion.toArray(),
        ];
    }

    Update(timeElapsed) {
        this.updateTimer_ -= timeElapsed;
        if (this.updateTimer_ <= 0.0 && this.loaded_) {
            this.updateTimer_ = 0.1;

            this.net_.SendTransformUpdate(this.CreateTransformPacket());
        }
    }
}
