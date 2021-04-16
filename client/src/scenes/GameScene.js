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

  const handleJump = (e) => {
    console.log("jumped");
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
        style={{ position: "absolute", right: "15%", bottom: "5%" }}
      >
        <Joystick move={handleDirection} stop={handleRelease}></Joystick>
      </div>

      <div id="jumpButton">
        <button
          style={{
            border: "2px solid",
            borderRadius: "50%",
            height: "10vh",
            width: "10vh",

            position: "absolute",
            right: "5%",
            bottom: "15%",

            outline: "none",
            userSelect: "none",
          }}
          onClick={handleJump}
        >
          Jump
        </button>
      </div>
      <p>GameScene</p>
    </div>
  );
};

export default GameScene;
