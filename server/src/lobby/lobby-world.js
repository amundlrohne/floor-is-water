import { Player } from "./player.js";
import { OPEN, CLOSED, IN_PROGRESS } from "../constants.js";

export default class Lobby {
    constructor(name, id, io) {
        this.name = name;
        this.id = id;
        this.ownerID;
        this.addNamespace(io);
        this.clients = [];
        this.status = OPEN;
        this.inProgress = false;

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
            this.status = CLOSED;
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

        console.log(`[LOBBY ${this.id}] ${socket.id} does not exist in lobby`);
        return null;
    };

    gameLoop = (namespace) => {
        namespace.emit("update-lobby", this);
        console.log(this.clients);
        if (this.status === CLOSED) return;

        setTimeout(() => {
            this.gameLoop(namespace);
        }, 300);
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
                this.status = IN_PROGRESS;
                this.clients.map((c, index) => c.setStartingTransform(index));
                namespace.emit("update-lobby", this); // Broadcast lobby update
                this.gameLoop(namespace);
            });
        });
    };
}
