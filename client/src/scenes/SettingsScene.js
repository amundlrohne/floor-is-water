import React from "react";
import { Link } from "react-router-dom";
import MenuScene from "./MenuScene";
import robot from "../audio/RobotParts.mp3";
import "./ScenesStyle.css";
//credit these guys where it is relevant https://www.youtube.com/watch?v=sSuHdn2dY9M



export const SettingsScene = () => {
    const bgmusic = new Audio(robot)

    bgmusic.loop = true;
    var isPlaying = false;

    function togglePlay() {
        if(isPlaying == false){
            bgmusic.play();
            isPlaying = true;
            document.getElementById("bgvalue").innerHTML = "On";
        }else{
            bgmusic.pause();
            isPlaying = false;
            document.getElementById("bgvalue").innerHTML = "Off";
        }
    };

    
  return (
  <div>
      <p>Settings</p>
      <div class="SettingsBar">
          <button type="button" onClick={togglePlay}>Background music</button>
          <p id="bgvalue">Off</p>
      </div>  
      <Link to={`/`}>Back</Link>      
    </div>
  );
};

export default SettingsScene;