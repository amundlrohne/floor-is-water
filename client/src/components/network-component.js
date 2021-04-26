import Component from "./component";

export class NetworkComponent extends Component {
    constructor(socket) {
        super();

        this.playerID_ = null;
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
            console.log(lobby);
            const clients = lobby.clients.filter((c) => c.id != this.socket.id);
            this.FindEntity("enemy1").Broadcast({
                topic: "network.update",
                transform: clients[0].transform,
            });

            /*
            for (let c of clients) {
                if (c.id != this.socket.id) {
                    console.log(c.id);
                    // Implement update enemies
                }
            }*/
        });

        this.socket.on("start-lobby", (lobby) => {
            this.spawnPlayers(lobby, this.socket.id);
        });

        this.socket.onAny((e, d) => {
            this.OnMessage_(e, d);
        });
    }

    SendTransformUpdate(transform) {
        this.socket.emit("update-client", transform);
    }

    SendActionAttack_() {
        this.socket.emit("action.attack");
    }

    GetEntityID_(serverID) {
        if (serverID == this.playerID_) {
            return "player";
        } else {
            return "__npc__" + serverID;
        }
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

    OnMessage_(e, d) {
        if (e == "world.player") {
            const spawner = this.FindEntity("spawners").GetComponent(
                "PlayerSpawner"
            );

            const player = spawner.Spawn();
            player.Broadcast({
                topic: "network.update",
                transform: d.transform,
            });

            console.log("entering world: " + d.id);
            this.playerID_ = d.id;
        } else if (e == "world.update") {
            const updates = d;

            const spawner = this.FindEntity("spawners").GetComponent(
                "NetworkEntitySpawner"
            );

            const ui = this.FindEntity("ui").GetComponent("UIController");

            for (let u of updates) {
                const id = this.GetEntityID_(u.id);

                let npc = null;
                if ("desc" in u) {
                    npc = spawner.Spawn(id, u.desc);

                    npc.Broadcast({
                        topic: "network.inventory",
                        inventory: u.desc.character.inventory,
                    });
                } else {
                    npc = this.FindEntity(id);
                }

                // Translate events, hardcoded, bad, sorry
                let events = [];
                if (u.events) {
                    for (let e of u.events) {
                        events.push({
                            type: e.type,
                            target: this.FindEntity(
                                this.GetEntityID_(e.target)
                            ),
                            attacker: this.FindEntity(
                                this.GetEntityID_(e.attacker)
                            ),
                            amount: e.amount,
                        });
                    }
                }

                ui.AddEventMessages(events);

                npc.Broadcast({
                    topic: "network.update",
                    transform: u.transform,
                    stats: u.stats,
                    events: events,
                });
            }
        } else if (e == "chat.message") {
            this.FindEntity("ui")
                .GetComponent("UIController")
                .AddChatMessage(d);
        }
    }
}
