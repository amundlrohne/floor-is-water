import React from "react";
import { Link } from "react-router-dom";
import LobbyScene from "./LobbyScene";
import SettingsScene from "./SettingsScene";



export const MenuScene = () => {
  return (
    <div>
      <p>Menu Scene</p>
      <ul>
          <li><Link to={`/lobby`}>Lobby</Link></li>
          <li><Link to={`/settings`}>Settings</Link></li>
      </ul>
    </div>
  );
};

export default MenuScene;