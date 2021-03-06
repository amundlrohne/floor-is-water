import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";

import { socket } from "../service/socket";
import "../css/global.css";

const LobbyList = () => {
    const history = useHistory();

    const [connected, setConnected] = useState(false);
    const [lobbys, setLobbys] = useState([]);

    const [newLobbyName, setNewLobbyName] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id);
        });

        socket.on("serve-lobbies", (data) => {
            setLobbys(data);
        });

        setConnected(socket.connected);
    }, [socket]);

    useEffect(() => {
        getLobbys();
    }, [connected]);

    const getLobbys = () => {
        if (connected) {
            socket.emit("requested-lobbies");
        }
    };

    const createLobby = () => {
        if (connected) {
            if (newLobbyName != "") {
                socket.emit("create-lobby", newLobbyName);
            } else {
                console.warn("Please enter lobby name");
            }
        }
    };

    const joinLobby = (lobbyID) => {
        if (connected) {
            //socket.emit("join-lobby", lobbyID);
            history.push("/lobby-detail/" + lobbyID);
        }
    };

    if (connected) {
        return (
            <div className="BgWrapper">
            <div className="BgGradient">
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="lobbiesWrapper">
                        <h1>Lobbies</h1>
                        <input
                            type="text"
                            value={newLobbyName}
                            placeholder="Lobby name..."
                            onChange={(e) => setNewLobbyName(e.target.value)}
                        />
                        <button onClick={createLobby}>New Lobby</button>
                        <button onClick={getLobbys}>Reload</button>

                        <div className="lobbyListHeader">
                            <div>Name</div>
                            <div>Size</div>
                        </div>
                        <div className="lobbies">
                            {lobbys.length > 0 ? (
                                lobbys.map((value, index) => {
                                    return (
                                        <div
                                            onClick={() => joinLobby(value.id)}
                                            key={index}
                                        >
                                            <div>{value.name}</div>
                                            <div>{value.clients.length}/4</div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Currently no active lobbies</p>
                            )}
                        </div>
                        <Link className="lobbyListBack" to={`/`}>
                            Back
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        );
    }

    return (
        <>
            <div className="BgWrapper">
                <div className="BgGradient">
                    <div className="LoadingWrapper">
                        <div>Loading...</div>
                        <Link to={`/`}>Back</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LobbyList;
