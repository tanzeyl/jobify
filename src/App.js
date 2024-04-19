import React, { useState } from "react";
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
import PaymentComponent from "./components/PaymentComponent";
import StudentTransactions from "./components/StudentTransactions";
import CompanyTransactions from "./components/CompanyTransactions";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  return (
    <>
      <Router>
        <div className="d-flex">
          <div className="col-md-2">
            <Navbar />
          </div>
          <div className="col-md-7">
            <Alert alert={alert} />
            <Routes>
              <Route exact path="/" element={<About />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route
                exact
                path="/companyProfile"
                element={<CompanyProfile showAlert={showAlert} />}
              />
              <Route
                exact
                path="/createJob"
                element={<CreateJob showAlert={showAlert} />}
              />
              <Route
                exact
                path="/allPostedJobs"
                element={<CompanyJobs showAlert={showAlert} />}
              />
              <Route
                exact
                path="/studentProfile"
                element={<StudentProfile showAlert={showAlert} />}
              />
              <Route
                exact
                path="/viewAllJobs"
                element={<AllJobs showAlert={showAlert} />}
              />
              <Route exact path="/appliedJobs" element={<AppliedJobs />} />
              <Route
                exact
                path="/paymentForm"
                element={<PaymentComponent showAlert={showAlert} />}
              />
              <Route
                exact
                path="/studentTransactions"
                element={<StudentTransactions />}
              />
              <Route
                exact
                path="/companyTransactions"
                element={<CompanyTransactions />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
