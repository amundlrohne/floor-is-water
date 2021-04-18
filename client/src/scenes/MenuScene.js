import React from "react";
import { Link } from "react-router-dom";
import LobbyScene from "./LobbyScene";
import SettingsScene from "./SettingsScene";
import CreditsScene from "./CreditsScene";
import "../css/scene.css";
import "../css/global.css";


export const MenuScene = () => {
  return (
    <div className="BgWrapper">
      <div className="menuWrapper">
        <h1>THE FLOOR IS WATER</h1>
        <ul>
            <li><Link to={`/lobby`}>Lobby</Link></li>
            <li><Link to={`/settings`}>Settings</Link></li>
            <li><Link to={`/credits`}>Credits</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default MenuScene;