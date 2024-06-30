import React from "react";
import "./bottomTab.css";
import { Link } from "react-router-dom";

import { AiFillHome } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { AiFillDollarCircle } from "react-icons/ai";
import { AiFillRobot } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";

const BottomTab = () => {
  return (
    <div className="main__container">
      <ul className="bottom__tabs">
        <li>
          <Link to="/">
            <AiFillHome size={25} />
          </Link>
        </li>
        <li>
          <Link to="/generate">
            <AiFillRobot size={25} />
          </Link>
        </li>
        <li>
          <Link to="/likes">
            <AiFillHeart size={25} />
          </Link>
        </li>
        <li>
          <Link to="/history">
            <FaHistory size={25} />
          </Link>
        </li>
        <li>
          <Link to="/pricing">
            <AiFillDollarCircle size={25} />
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default BottomTab;
