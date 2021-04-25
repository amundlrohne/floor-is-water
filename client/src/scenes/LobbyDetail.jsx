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

  const handleRemove = (user, index) => {
    socket.emit("remove-player", user);
  };

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
        <div className="colorPicker">
          <label for="colors">Choose a color:</label>
          <select name="colors" id="colors">
            <option value="orange">Orange</option>
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </div>

        <div className="players">
          {lobby.clients.map((value, index) => {
            if (
              localStorage.getItem("username") === lobby.clients[0].username &&
              index !== 0
            ) {
              return (
                <div className="playerEntry" key={index}>
                  <div>{value.username}</div>
                  <button
                    onClick={() => {
                      handleRemove(value, index);
                    }}
                  >
                    Remove Player
                  </button>
                </div>
              );
            } else {
              return (
                <div className="playerEntry" key={index}>
                  <div>{value.username}</div>
                </div>
              );
            }
          })}
        </div>
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
