import React from "react";

export default function About() {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Jobify</h5>
          <h6 className="card-subtitle mb-2">About Us</h6>
          <p className="card-text">
            Welcome to our job finding website, where we connect talented
            individuals with exciting employment opportunities. Whether you're a
            seasoned professional looking for your next career move or a fresh
            graduate eager to start your journey, our platform offers a wide
            range of job listings from diverse industries. With user-friendly
            search features and personalized job recommendations, finding the
            perfect job has never been easier. Join our community today and take
            the next step towards a fulfilling career!
          </p>
          <a href="/" className="card-link">
            Login
          </a>
          <a href="/" className="card-link">
            Sign Up
          </a>
        </div>
      </div>
    </>
  );
}
