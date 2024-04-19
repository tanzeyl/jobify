import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51P6oiySFDJeJuSO27j8EB4NmP0jQDzhe55S0KLfcAdseOddaO7i9dx3HjycXOO6Bpp0sF8FD9bD6fwPhq9QWzN3B00gzWbVNE2"
);

const PaymentComponent = (props) => {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <CheckoutForm showAlert={props.showAlert} />
      </Elements>
    </div>
  );
};

export default PaymentComponent;
