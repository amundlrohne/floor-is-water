import React from "react";
import Link from "react-router-dom";
import { Joystick } from "react-joystick-component";
import Main from "../main.jsx";
import "./gamescene.css";

const GameScene = () => {
  const handleMove = (e) => {
    console.log(e);
  };

  const handleMoveStop = (e) => {
    console.log(e);
  };

  const handleDirection = (e) => {
    console.log(e);
  };

  const handleRelease = (e) => {
    console.log("released");
  };

  const handleJump = (e) => {
    console.log("jumped");
  };

  return (
    <div className="gameSceneContainer">
      <Main></Main>
      <div id="controls">
        <div className="leftJoystick">
          <Joystick move={handleMove} stop={handleMoveStop}></Joystick>
        </div>
        <div className="rightJoystick">
          <Joystick move={handleDirection} stop={handleRelease}></Joystick>
        </div>

        <div className="jumpButton">
          <button onClick={handleJump}>Jump</button>
        </div>
      </div>
    </div>
  );
};

export default GameScene;
