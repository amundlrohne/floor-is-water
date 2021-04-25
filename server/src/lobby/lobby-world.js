import { Player, STARTING_TRANSFORMS } from "./player.js";

class SocketWrapper {
    constructor(socket) {
        this.socket = socket;
        this.onMessage = null;
        this.dead = false;
        this.SetupSocket();
    }

    get ID() {
        return this.socket.id;
    }

    get IsAlive() {
        return !this.dead;
    }

    SetupSocket() {
        this.socket.on("user-connected", () => {
            console.log("socket.id: " + this.socket.id);
        });
        this.socket.on("disconnect", () => {
            console.log(socket.id + " disconnected");
            this.dead = true;
        });
        this.socket.onAny((e, d) => {
            try {
                if (!this.onMessage(e, d)) {
                    console.log("Unkown command: " + e + ", disconnected.");
                    this.Disconnect();
                }
            } catch (err) {
                console.error(err);
                this.Disconnect();
            }
        });
    }

    Disconnect() {
        this.socket.disconnect(true);
    }

    Send(msg, data) {
        this.socket.emit(msg, data);
    }
}

export default class Lobby {
    constructor(name, id, io) {
        this.name = name;
        this.id = id;
        this.ownerID;
        this.addNamespace(io);
        this.clients = [];
        this.active = true;

        console.log(`[LOBBY ${this.id}] Created lobby.`);
    }

    // Add client to lobby
    addClient = (username, socket) => {
        if (this.clients.length == 0) {
            this.ownerID = socket.id;
        }

        if (this.clients.length < 4) {
            const c = this.findClient(socket);
            if (c != null) {
                console.log(`[LOBBY ${this.id}] Client already in lobby.`);
                return;
            }

            this.clients.push(new Player(username, socket.id));
            console.log(`[LOBBY ${this.id}] Client joined lobby.`);
        } else {
            console.log(
                `[LOBBY ${this.id}] Client attempted to join full lobby.`
            );
        }
    };

    // Remove client from lobby
    removeClient = (socket) => {
        console.log(`[LOBBY ${this.id}] Client disconnected`);
        this.clients = this.clients.filter((c) => c.id != socket.id);

        // Delete lobby if disconnection results in 0 players.
        if (this.clients == 0) {
            console.log(`[LOBBY ${this.id}] Terminated.`);
            this.active = false;
            return;
        }

        this.ownerID = this.clients[0].id;
    };

    // Update client transform
    updateClient = (transform, socket) => {
        const c = this.findClient(socket);

        if (c == null) {
            return;
        }

        c.transform = transform;
    };

    // Find client by socket id
    findClient = (socket) => {
        for (let c of this.clients) {
            if (c.id == socket.id) {
                return c;
            }
        }

        console.log(`[LOBBY ${this.id}] ${$socket.id} does not exist`);
        return null;
    };

    gameLoop = (namespace) => {
        namespace.emit("update-lobby", this);

        setTimeout(() => {
            this.gameLoop();
        }, 100);
    };

    /*
        Make event for GAMESTART (Spawn players and enemies on this eventa)
        Place entities on map accordingly 
        Start gameloop
        update clients 
        listen for player update 
        RIP out old messaging system, replace with specified listeners. 
    */

    addNamespace = (io) => {
        const namespace = io.of("/" + this.id);

        namespace.on("connection", (socket) => {
            socket.on("disconnect", () => {
                this.removeClient(socket);
                namespace.emit("update-lobby", this); // Broadcast lobby update
            });

            socket.on("join-lobby", (username) => {
                this.addClient(username, socket);
                namespace.emit("update-lobby", this); // Broadcast lobby update
            });

            socket.on("update-client", (transform) => {
                this.updateClient(transform, socket);
            });

            socket.on("request-start-lobby", () => {
                // Add verification for socket.id = owner
                this.clients.map((c, index) => c.setStartingTransform(index));
                namespace.emit("start-lobby", this);
                this.gameLoop(namespace);
            });
        });
    };
}
