import React from "react";
import "./pricing.css";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();
  const price = 200;
  const price2 = 1000;
  const price3 = 5000;
  return (
    <div>
      <h1 className="text-center heading mt-2">Buy Credits</h1>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="pricing-card-container">
              <p className="type">10 Credits</p>
              <p className="pkg-price">
                <sup>Rs</sup>
                {price}
              </p>
              <input
                onClick={() =>
                  navigate("/payment", { state: { purchasePrice: price } })
                }
                type="button"
                value="Proceed to Checkout"
                className="price-btn"
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="pricing-card-container">
              <p className="type">50 Credits</p>
              <p className="pkg-price">
                <sup>Rs</sup>
                {price2}
              </p>
              <input
                onClick={() =>
                  navigate("/payment", { state: { purchasePrice: price2 } })
                }
                type="button"
                value="Proceed to Checkout"
                className="price-btn"
              />
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="pricing-card-container">
              <p className="type">100 Credits</p>
              <p className="pkg-price">
                <sup>Rs</sup>
                {price3}
              </p>
              <input
                onClick={() =>
                  navigate("/payment", { state: { purchasePrice: price3 } })
                }
                type="button"
                value="Proceed to Checkout"
                className="price-btn"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
