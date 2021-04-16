import React from "react";
import Button from "../components/button";
import Link from "react-router-dom";

const GameScene = () => {
  return (
    <div className="gameSceneContainer">
      <canvas className="gameCanvas"></canvas>

      <p>GameScene</p>
    </div>
  );
};

export default GameScene;
