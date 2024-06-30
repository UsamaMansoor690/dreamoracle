import React, { useEffect, useState } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { auth, signInWithGoogle, signout } from "../../Firebase";

const Navbar = () => {
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

  const handleSignin = async () => {
    await signInWithGoogle();
  };

  const handleSignout = async () => {
    await signout();
  };

  return (
    <nav>
      <ul className="main__list">
        <li className="logo">
          <h4 className="first__name">Dream Oracle</h4>
        </li>

        <ul className="links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/generate">Generate</Link>
          </li>
          <li>
            <Link to="/likes">Likes</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
          <li>
            <Link to="/pricing">Pricing</Link>
          </li>
        </ul>

        {userStatus ? (
          <div className="btn_and_profile">
            <img
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
              src={localStorage.getItem("profilePic")}
              alt="profile"
              title={localStorage.getItem("name")}
            />
            <button
              className="sign__in__btn"
              type="button"
              onClick={handleSignout}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="sign__in__btn"
            type="button"
            onClick={handleSignin}
          >
            Sign In
          </button>
        )}

        {/* <button
          className='sign__in__btn'
          type='button'
          onClick={signInWithGoogle}
        >
          Sign In
        </button> */}
      </ul>
    </nav>
  );
};

export default Navbar;
