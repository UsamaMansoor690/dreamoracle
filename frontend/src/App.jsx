import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/home/Home";
import Generate from "./Generate";
import History from "./components/history/History";
import Likes from "./components/likes/Likes";
import Pricing from "./components/pricing/Pricing";
import Navbar from "./components/navbar/Navbar";
import BottomTab from "./components/bottomTab/BottomTab";
import { auth } from "./Firebase";
import PaymentForm from "./components/checkout/PaymentForm";

/* Payment Handler */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  const [userStatus, setUserStatus] = useState(false);
  const [likedImages, setLikedImages] = useState([]);
  const [history, setHistory] = useState([]);

  const stripePromise = loadStripe(
    "pk_test_51PD5SZ07BrGXMIuFXrCx4qAuD5N4S1Z9Es4NJzevESILmJydX98ayF7HOonm3Gw3QpWJNmeC69k4OEcNmUAKPpkG00jEQld6jP"
  );

  useEffect(() => {
    fetchFromDB();
    fetchHistoryFromDB();

    const initializerOfHistory = () => {
      const historyImagesFromStoraage = localStorage.getItem("historyImages");
      if (historyImagesFromStoraage) {
        setHistory(JSON.parse(historyImagesFromStoraage));
      }
    };

    const initializeStateFromLocalStorage = () => {
      const likedImagesFromStorage = localStorage.getItem("likedImages");
      if (likedImagesFromStorage) {
        setLikedImages(JSON.parse(likedImagesFromStorage));
      }
    };

    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserStatus(true);
        fetchFromDB();
        fetchHistoryFromDB();
      } else {
        setUserStatus(false);
        setLikedImages([]);
        setHistory([]);
      }
    });

    initializeStateFromLocalStorage();
    initializerOfHistory();
  }, [userStatus]);

  const fetchFromDB = async () => {
    if (userStatus) {
      const userEmail = localStorage.getItem("email");
      const response = await fetch(
        `http://127.0.0.1:5000/get_images/${userEmail}`
      );
      const data = await response.json();
      setLikedImages(data.images);
      localStorage.setItem("likedImages", JSON.stringify(data.images));
    }
  };

  const fetchHistoryFromDB = async () => {
    if (userStatus) {
      const userEmail = localStorage.getItem("email");
      const response = await fetch(
        `http://127.0.0.1:5000/getHistory/${userEmail}`
      );
      const data = await response.json();
      setHistory(data.images);
      localStorage.setItem("historyImages", JSON.stringify(data.images));
    }
  };

  const updateImages = () => {
    fetchFromDB();
  };

  const updateHistory = () => {
    fetchHistoryFromDB();
  };

  return (
    <div className="main__div">
      <Navbar />
      {/* Routes Intialized Here */}
      <div className="routes__container">
        <Routes>
          <Route path="/" element={<Home callBack={updateImages} />} />
          <Route
            path="/generate"
            element={<Generate callBack={updateHistory} />}
          />
          <Route path="/history" element={<History history={history} />} />
          <Route
            path="/likes"
            element={
              <Likes myLikedImages={likedImages} callBack={updateImages} />
            }
          />
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/payment"
            element={
              <Elements stripe={stripePromise}>
                {" "}
                <PaymentForm />{" "}
              </Elements>
            }
          />
        </Routes>
      </div>
      <div className="footer">
        <BottomTab />
      </div>
    </div>
  );
}

export default App;
