import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";
import CompanyProfile from "./components/CompanyProfile";
import CreateJob from "./components/CreateJob";
import CompanyJobs from "./components/CompanyJobs";
import Alert from "./components/Alert";
import StudentProfile from "./components/StudentProfile";
import AllJobs from "./components/AllJobs";
import AppliedJobs from "./components/AppliedJobs";

function App() {
  return (
    <>
      <Router>
        <div className="d-flex">
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
              <Route exact path="/createJob" element={<CreateJob />} />
              <Route exact path="/allPostedJobs" element={<CompanyJobs />} />
              <Route
                exact
                path="/studentProfile"
                element={<StudentProfile />}
              />
              <Route exact path="/viewAllJobs" element={<AllJobs />} />
              <Route exact path="/appliedJobs" element={<AppliedJobs />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
