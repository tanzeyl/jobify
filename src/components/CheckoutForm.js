import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import "../styles/Payment.css";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (error) {
      console.error(error);
      return;
    }
    const { id } = paymentMethod;
    if (localStorage.getItem("userType") === "student") {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/userPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            amount: amount,
            currency: "inr",
            paymentMethodId: id,
          }),
        }
      );
      const json = await response.json();
      setLoading(false);
      navigate("/studentProfile");
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/companyPayment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            amount: amount,
            currency: "inr",
            paymentMethodId: id,
          }),
        }
      );
      const json = await response.json();
      setLoading(false);
      navigate("/companyProfile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Enter number of coins to buy (1 coin = Rs. 1)
        </label>
        <input
          type="number"
          className="form-control"
          id="amount"
          name="amount"
          onChange={onChange}
        />
      </div>
      <div className="card-element">
        <CardElement />
      </div>
      <div className="d-flex justify-content-evenly">
        <button type="submit" disabled={!stripe} className="pay-button">
          Pay
        </button>
        {loading && <Spinner />}
      </div>
    </form>
  );
};

export default CheckoutForm;
