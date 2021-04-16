import React from "react";
import Link from "react-router-dom";
import { Joystick } from "react-joystick-component";
import "./gamescene.css";

const GameScene = () => {
  return (
    <div className="gameSceneContainer">
      <canvas
        className="gameCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <Joystick id="leftJoystick"></Joystick>
      <Joystick id="rightJoystick"></Joystick>
      <p>GameScene</p>
    </div>
  );
};

export default GameScene;
