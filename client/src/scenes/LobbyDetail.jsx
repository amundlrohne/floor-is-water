import React, { useCallback, useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

import { lobbySocket } from "../service/socket";

import "../css/scene.css";

let socket;

const LobbyDetail = () => {
    const [lobby, setLobby] = useState(null);
    const [disconnect, setDisconnect] = useState(false);
    let { lobbyID } = useParams();
    const history = useHistory();

    const handleLobbyUpdate = useCallback((lobby) => {
        console.log(lobby);
        setLobby(lobby);
    }, []);

    // Render once
    useEffect(() => {
        socket = lobbySocket(lobbyID);
    }, []);

    // Rerender on socket update
    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id);
            socket.emit("join-lobby", localStorage.getItem("username"));
        });

        socket.on("update-lobby", handleLobbyUpdate);

        return () => {};
    }, [socket]);

    // Disconnect
    useEffect(() => {
        if (disconnect) {
            socket.disconnect();
            history.push("/lobby-list");
        }
    }, [disconnect]);

    if (lobby != null) {
        return (
            <div className="lobbyWrapper">
                <h3>{lobby.name}</h3>
                <ul>
                    {lobby.clients.map((value, index) => {
                        return <li key={index}>{value.username}</li>;
                    })}
                </ul>
                <div
                    onClick={() => {
                        setDisconnect(true);
                    }}
                    className="disconnectButton"
                >
                    DISCONNECT
                </div>
            </div>
        );
    }

    return (
        <>
            <div>Loading...</div>
            <Link to={`/`}>Back</Link>
        </>
    );
};

export default LobbyDetail;
