import React, { useState, useEffect } from "react";
import "./history.css";

const History = ({ history }) => {
  const [range, setRange] = useState(5);
  const [maxRange, setMaxRange] = useState(8);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

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
      <h1 className="history__heading">History</h1>

      <div className="range__wrapper">
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
        {history ? (
          history.map((item) => {
            return (
              <div
                style={{ position: "relative" }}
                key={item.id}
                className="box"
                id="box"
              >
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
          <p>No History</p>
        )}
      </div>
      {/* <div id='range' className={`col col-${range}`}>
    {images.map((images, i) => {
      return (
        <div key={i} className='box'>
          <img src={images.path} alt='' />
        </div>
      );
    })}
  </div> */}
    </div>
  );
};

export default History;
