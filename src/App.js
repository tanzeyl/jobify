import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Cloudinary } from "@cloudinary/url-gen";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";
import CompanyProfile from "./components/CompanyProfile";

function App() {
  const cld = new Cloudinary({ cloud: { cloudName: "djptg7azn" } });
  return (
    <>
      <Router>
        <div className="row">
          <div className="col-md-2">
            <Navbar />
          </div>
          <div className="col-md-7">
            <Routes>
              <Route exact path="/" element={<About />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route
                exact
                path="/companyProfile"
                element={<CompanyProfile />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
