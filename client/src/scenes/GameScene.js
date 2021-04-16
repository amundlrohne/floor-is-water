import React from "react";
import Link from "react-router-dom";
import { Joystick } from "react-joystick-component";
require("./gamescene.css");

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

  return (
    <div className="gameSceneContainer">
      <canvas
        className="gameCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <div
        id="leftJoystick"
        style={{ position: "absolute", left: "5%", bottom: "5%" }}
      >
        <Joystick move={handleMove} stop={handleMoveStop}></Joystick>
      </div>
      <div
        id="rightJoystick"
        style={{ position: "absolute", right: "5%", bottom: "5%" }}
      >
        <Joystick move={handleDirection} stop={handleRelease}></Joystick>
      </div>
      <p>GameScene</p>
    </div>
  );
};

export default GameScene;
