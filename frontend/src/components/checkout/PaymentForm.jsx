import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import "./paymentForm.css";

// const totalPrice = 100;

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { purchasePrice } = location.state || {};
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    fetch("http://localhost:3001/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ price: purchasePrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  const makePayment = async (event) => {
    event.preventDefault();

    // Collect payment method (card details)
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      // Handle case where payment method is not entered
      setPaymentError("Please enter your payment method.");
      return;
    }

    // Confirm payment with collected payment method
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          // You can add additional parameters here if needed
        },
      }
    );

    if (error) {
      // Handle payment error
      console.error("Payment failed:", error.message);
      setPaymentError(error.message);
      setPaymentSuccess(false);
    } else {
      // Payment succeeded, handle success
      console.log("Payment successful:", paymentIntent);
      setPaymentSuccess(true);
      setPaymentError(null);
      resetForm();
      alert("Credits edited Successfully");
      if (purchasePrice === 200) {
        handleCreditPurchase(10);
        navigate("/generate");
      } else if (purchasePrice === 1000) {
        handleCreditPurchase(50);
        navigate("/generate");
      } else if (purchasePrice === 5000) {
        handleCreditPurchase(100);
        navigate("/generate");
      }
    }
  };

  /* This function is to handle the purchased Credits */
  const handleCreditPurchase = (newCredit) => {
    const prev = localStorage.getItem("credits");
    const parsedCredit = JSON.parse(prev);
    const updated = parsedCredit + newCredit;
    localStorage.setItem("credits", JSON.stringify(updated));
  };

  // Function to handle changes to the CardElement
  const handleChange = () => {
    // Reset payment error when payment method is entered
    setPaymentError(null);
  };

  // Function to reset the form
  const resetForm = () => {
    elements.getElement(CardElement).clear();
  };

  const cardStyle = {
    style: {
      base: {
        color: "#fff",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#fff",
        },
      },
    },
  };

  return (
    <div>
      <h3
        style={{ marginTop: "9px", marginBottom: "30px" }}
        className="heading"
      >
        Payment Checkout
      </h3>
      <form id="payment-form" onSubmit={makePayment}>
        <div className="wrapper">
          <CardElement
            options={cardStyle}
            id="card-element"
            onChange={handleChange}
          />
        </div>
        <div className="btn_wrapper">
          <button id="submit" className="sign__in__btn">
            {" "}
            Pay Now: Rs{purchasePrice}
          </button>
        </div>
        {paymentError && <div style={{ color: "red" }}>{paymentError}</div>}
      </form>
      {paymentSuccess && (
        <div style={{ color: "white" }}>Payment successful!</div>
      )}
    </div>
  );
};

export default PaymentForm;
