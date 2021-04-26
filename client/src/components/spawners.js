import Component from "./component";
import { NetworkPlayerComponent } from "./network-player-component";
import { PlayerEntity } from "../entities/player";
export class PlayerSpawner extends Component {
    constructor(camera, scene) {
        super();
        // MISSING PARAMETERS
    }

    Spawn() {
        player = new PlayerEntity({
            camera: controls,
            scene: scene,
            physicsHandler: physicsHandler,
            radius: 2,
            height: 1,
            segments: 32,
            type: "sphere",
            position: new th.Vector3(50, 10, 50),
        });
        player.AddComponent(new NetworkPlayerComponent());

        this.Manager.Add(player, "player");

        return player;
    }
}
