import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
          <Joystick
            move={handleMove}
            stop={handleMoveStop}
            stickColor={"#fcba03"}
            baseColor={"#ad7f00"}
          ></Joystick>
        </div>
        <div className="rightJoystick">
          <Joystick
            move={handleDirection}
            stop={handleRelease}
            stickColor={"#fcba03"}
            baseColor={"#ad7f00"}
          ></Joystick>
        </div>

        <div className="jumpButton">
          <button onClick={handleJump}>Jump</button>
        </div>
      </div>

      <div className="gameResults">
        <p>Taper Idiot</p>
        <Link to="/">
          <button>Back to menu</button>
        </Link>
      </div>
    </div>
  );
};

export default GameScene;
