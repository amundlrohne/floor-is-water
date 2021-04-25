import React from "react";
import { Link } from "react-router-dom";
import "../css/scene.css";

export const CreditsScene = () => {
  return (
    <div className="CreditsWrapper">
      <h2>Credits</h2>
      <ul>
        <li>
          Backgroundphoto by{" "}
          <a href="https://unsplash.com/@lazycreekimages?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Michael Dziedzic
          </a>{" "}
          on Unsplash
        </li>
        <li>
          Robot model by{" "}
          <a href="https://quaternius.itch.io/lowpoly-robot">Quaternius</a>
        </li>
        <li>
          Column models by{" "}
          <a href="https://korveen.itch.io/lowpoly-ruins-pack">kOrveen</a>
        </li>
        <li>
          Background music by Karl Casey from{" "}
          <a href="https://www.youtube.com/watch?v=sSuHdn2dY9M">
            White Bat Audio
          </a>
        </li>
        <li>
          Water texture by{" "}
          <a href="https://www.deviantart.com/berserkitty/art/Seamless-Cartoon-styled-Water-Texture-743787929?fbclid=IwAR1GWftxTsPZv8mDdQw62cky8gSFIfAKaBKmDFSTriZFq6tcqZ2UD9vxSls">
            Berserkitty
          </a>
        </li>
        <li>
          Gems models in powerups by{" "}
          <a href="https://godgoldfear.itch.io/low-poly-gems-pack-2">
            Godgoldfear
          </a>
        </li>
        <li>
          Font by{" "}
          <a href="https://www.1001freefonts.com/audiowide.font">
            {" "}
            Brian J. Bonislawsky, aka: Astigmatic
          </a>
        </li>
        <li>Game developed by the members of group 16</li>
      </ul>

      <Link to={`/`}>Back</Link>
    </div>
  );
};

export default CreditsScene;
