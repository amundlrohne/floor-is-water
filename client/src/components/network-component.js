import Component from "./component";

export class NetworkComponent extends Component {
    constructor(socket) {
        super();

        this.socket = socket;
        this.setupSocket();
    }

    setupSocket() {
        this.socket.on("connect", () => {
            console.log(this.socket.id);

            this.socket.emit(
                "login.commit",
                document.getElementById("login-input").value
            );
        });

        this.socket.on("disconnect", () => {
            console.log("DISCONNECTED: " + this.socket.id); // undefined
        });

        this.socket.on("update-lobby", (lobby) => {
            const clients = lobby.clients.filter((c) => c.id != this.socket.id);
            this.FindEntity("enemy1").Broadcast({
                topic: "network.update",
                transform: clients[0].transform,
            });
        });

        this.socket.on("start-lobby", (lobby) => {
            this.spawnPlayers(lobby, this.socket.id);
        });
    }

    SendTransformUpdate(transform) {
        this.socket.emit("update-client", transform);
    }

    spawnPlayers(lobby, socketID) {
        const clients = lobby.clients;
        const playerTransform = clients.filter((c) => c.id == socketID)
            .transform[0];
        const spawner = this.FindEntity("spawners").GetComponent(
            "PlayerSpawners"
        );

        const player = spawner.Spawn();
        player.Broadcast({
            topic: "network.update",
            transform: playerTransform,
        });
    }
}
