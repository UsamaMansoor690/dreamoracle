import React, { useEffect, useState } from "react";
import "./likes.css";

/* Search Icon */
import { CiSearch } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";

const Likes = ({ myLikedImages, callBack }) => {
  const [range, setRange] = useState(5);
  const [maxRange, setMaxRange] = useState(8);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const deleteImage = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/deleteImage/${id}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        callBack();
      }
    } catch (error) {
      alert(error);
    }
  };

  // function to update window size
  const updateWindowSize = () => {
    setWindowSize(window.innerWidth);
  };

  // useEffect to track the window size change
  useEffect(() => {
    document.getElementById(
      "range"
    ).style.gridTemplateColumns = `repeat(${range}, 1fr)`;
    window.addEventListener("resize", updateWindowSize);

    if (windowSize <= 757) {
      document.getElementById("range").style.gap = "5px";
      setMaxRange(4);
    } else if (windowSize <= 1000) {
      setMaxRange(6);
    } else if (windowSize > 1000 && range <= "3") {
      document.getElementById("range").style.gap = "40px";
      setMaxRange(8);
    } else if (windowSize > 1000 && range >= "4") {
      document.getElementById("range").style.gap = "5px";
      setMaxRange(8);
    } else {
      setMaxRange(8);
    }
  }, [windowSize, range]);

  /* Function that keep track the value of range variable */
  const handleRange = (event) => {
    const newValue = event.target.value;
    setRange(newValue);
  };

  return (
    <div>
      <h1 className="likes__heading">Likes</h1>

      <div className="like__range__wrapper">
        <p>columns: {range}</p>
        <input
          type="range"
          id="col__range"
          min={1}
          max={maxRange}
          step={1}
          value={range}
          onChange={handleRange}
        />
      </div>

      <div id="range" className={`col col-${range}`}>
        {myLikedImages ? (
          myLikedImages.map((item) => {
            return (
              <div
                style={{ position: "relative" }}
                key={item.id}
                className="box"
                id="box"
              >
                <div className="icons__wrapper">
                  <div className="icons">
                    <span>
                      <CiSearch size={20} />
                    </span>
                    <span onClick={() => deleteImage(item.id)}>
                      <AiOutlineHeart size={20} />
                    </span>
                  </div>
                </div>
                <img
                  loading="lazy"
                  id="img"
                  src={item.imgPath}
                  alt={item.desc}
                />
                <div className="content__wrapper">
                  <p className="images__prompt">{item.desc}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>Not liked</p>
        )}
      </div>
    </div>
  );
};

export default Likes;
