import React from "react";
import { Link } from "react-router-dom";
import MenuScene from "./MenuScene";
import robot from "../audio/RobotParts.mp3";
//credit these guys where it is relevant https://www.youtube.com/watch?v=sSuHdn2dY9M



export const SettingsScene = () => {
    const bgmusic = new Audio(robot)

    bgmusic.loop = true;
    var isPlaying = false;

    function togglePlay() {
        if(isPlaying == false){
            bgmusic.play();
            isPlaying = true;
        }else{
            bgmusic.pause();
            isPlaying = false;
        }
    };

    
  return (
    <div>
      <p>Settings</p>

      <Link to={`/`}>Back</Link>
      <button type="button" onClick={togglePlay}>Audio</button>
      
    </div>
  );
};

export default SettingsScene;