import React from "react";
import { Link } from "react-router-dom";
import MenuScene from "./MenuScene";

export const SettingsScene = () => {
  return (
    <div>
      <p>Settings</p>
      <Link to={`/`}>Back</Link>
      
    </div>
  );
};

export default SettingsScene;