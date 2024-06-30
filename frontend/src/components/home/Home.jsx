import React, { useEffect, useState } from "react";
import "./home.css";
import { auth } from "../../Firebase";

/* Search Icon */
import { BiSearch } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { AiOutlineHeart } from "react-icons/ai";

/* Images */
import img7 from "../../assets/images/image_07.jpg";
import img8 from "../../assets/images/image_08.jpg";
import img9 from "../../assets/images/image_09.jpg";
import img10 from "../../assets/images/image_10.jpg";
import img11 from "../../assets/images/image_11.jpg";
import img12 from "../../assets/images/image_12.jpg";
import img13 from "../../assets/images/image_13.jpg";
import img17 from "../../assets/images/image_17.jpg";
import img18 from "../../assets/images/image_18.jpg";

const Home = ({ callBack }) => {
  const [range, setRange] = useState(5);
  const [maxRange, setMaxRange] = useState(8);
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  /* This handle user is signedIn or not */
  const [userStatus, setUserStatus] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserStatus(true);
      } else {
        setUserStatus(false);
      }
    });
  }, []);

  /* Array of Images Objects */
  const images = [
    {
      id: 1,
      path: img7,
      desc: "gray and red feathers on a bird, in the style of yellow and orange",
    },
    {
      id: 2,
      path: img8,
      desc: "A bird with orange body and blue feather and beak",
    },
    {
      id: 3,
      path: img9,
      desc: "Extremely realistic gray bird.",
    },
    {
      id: 4,
      path: img10,
      desc: "A pity yellow bird build her nest from twigs and moss on a tree branch",
    },
    {
      id: 5,
      path: img11,
      desc: "A colorful bird with long beak",
    },
    {
      id: 6,
      path: img12,
      desc: "Massive bird with black feathers and silver eyes",
    },
    {
      id: 7,
      path: img13,
      desc: "Metal hooter honk, 8k, high quality.",
    },
    {
      id: 8,
      path: img17,
      desc: "A grey bird",
    },
    {
      id: 9,
      path: img18,
      desc: "A white piegon",
    },
  ];

  const handleLike = async (item) => {
    if (userStatus) {
      const userEmail = localStorage.getItem("email");
      const img_path = item.path;
      const img_desc = item.desc;

      const data = {
        userEmail,
        img_path,
        img_desc,
      };
      console.log(data);

      const url = "http://127.0.0.1:5000/addImages";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, options);
      if (response.status !== 201 && response.status !== 200) {
        const data = await response.json();
        alert(data.message);
      } else {
        /* Getting the updated Images */
        callBack();
      }
    } else {
      alert("You need to signed in First");
      return;
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
      <h1 className="heading">Dream Oracle</h1>

      {/* Search Bar */}
      {/* <div className="home__search__bar">
        <span>
          <BiSearch size={20} />
        </span>
        <input
          type="text"
          id="home__search"
          placeholder="Search for an Image"
        />
      </div> */}

      {/* Buttons (Search and Generate) below Search Bar */}
      {/* <div className="btns">
        <button className="sign__in__btn search__btn" type="button">
          Search
        </button>
        <button className="sign__in__btn gen__btn" type="button">
          Generate
        </button>
      </div> */}

      {/* Range that adjust the images Columns */}
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
        {images.map((images, i) => {
          return (
            <div
              style={{ position: "relative" }}
              key={i}
              className="box"
              id="box"
            >
              <div className="icons__wrapper">
                <div className="icons">
                  <span>
                    <CiSearch size={20} />
                  </span>
                  <span onClick={() => handleLike(images)}>
                    <AiOutlineHeart size={20} />
                  </span>
                </div>
              </div>
              <img
                loading="lazy"
                id="img"
                src={images.path}
                alt={images.desc}
              />
              <div className="content__wrapper">
                <p className="images__prompt">{images.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
