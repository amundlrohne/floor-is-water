import React, { useDebugValue, useEffect } from "react";
import { Link } from "react-router-dom";
import MenuScene from "./MenuScene";
import robot from "../assets/audio/RobotParts.mp3";

const bgmusic = new Audio(robot)

var isPlaying = false;
export const SettingsScene = () => {
    useEffect(()=>{
        if(isPlaying==true){
            document.getElementById("bgvalue").innerHTML = "On";
        }else{
            document.getElementById("bgvalue").innerHTML = "Off";
        }
    });

    bgmusic.loop = true;

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
  <div class="SettingsWrapper"> 
      <h2>Settings</h2>
      <div class="SettingsBar">
          <button type="button" onClick={togglePlay}>Background music</button>
          <p id="bgvalue"></p>
      </div>  
      <Link to={`/`}>Back</Link>      
   </div>
  );
};

export default SettingsScene;