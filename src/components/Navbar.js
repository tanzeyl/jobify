import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/signup");
  };

  return (
    <>
      <div className="Sidebar">
        <div className="menu">
          <div className="menuOptions">
            {!localStorage.getItem("token") && (
              <div className="option">
                <Link className="nav-link optionContent" to="/signup">
                  <i className="fa-solid fa-user-plus"></i>
                  <h5 className="optionTitle">Sign Up</h5>
                </Link>
              </div>
            )}

            {!localStorage.getItem("token") && (
              <div className="option">
                <Link className="nav-link optionContent" to="/login">
                  <i className="fa-solid fa-mobile"></i>
                  <h5 className="optionTitle">Log In</h5>
                </Link>
              </div>
            )}

            {localStorage.getItem("userType") &&
              localStorage.getItem("userType") === "company" && (
                <div className="option">
                  <Link className="nav-link optionContent" to="/companyProfile">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <h5 className="optionTitle">View Profile</h5>
                  </Link>
                </div>
              )}

            {localStorage.getItem("userType") &&
              localStorage.getItem("userType") === "student" && (
                <div className="option">
                  <Link className="nav-link optionContent" to="/studentProfile">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <h5 className="optionTitle">View Profile</h5>
                  </Link>
                </div>
              )}

            {localStorage.getItem("userType") &&
              localStorage.getItem("userType") === "company" && (
                <div className="option">
                  <Link className="nav-link optionContent" to="/allPostedJobs">
                    <i className="fa-solid fa-list"></i>
                    <h5 className="optionTitle">View Jobs</h5>
                  </Link>
                </div>
              )}

            {localStorage.getItem("userType") &&
              localStorage.getItem("userType") === "student" && (
                <div className="option">
                  <Link className="nav-link optionContent" to="/appliedJobs">
                    <i className="fa-solid fa-list"></i>
                    <h5 className="optionTitle">Applied Jobs</h5>
                  </Link>
                </div>
              )}

            {localStorage.getItem("userType") &&
              localStorage.getItem("userType") === "company" && (
                <div className="option">
                  <Link className="nav-link optionContent" to="/createJob">
                    <i className="fa-solid fa-plus"></i>
                    <h5 className="optionTitle">Create Job</h5>
                  </Link>
                </div>
              )}

            {localStorage.getItem("userType") &&
              localStorage.getItem("userType") === "student" && (
                <div className="option">
                  <Link className="nav-link optionContent" to="/viewAllJobs">
                    <i className="fa-solid fa-list"></i>
                    <h5 className="optionTitle">All Jobs</h5>
                  </Link>
                </div>
              )}

            <div className="option">
              <Link className=" nav-link optionContent" to="/">
                <i className="fa-solid fa-address-card"></i>
                <h5 className="optionTitle">About Us</h5>
              </Link>
            </div>

            {localStorage.getItem("token") && (
              <div className="option">
                <Link className="nav-link optionContent" to="">
                  <i className="fa-solid fa-mobile" onClick={handleLogout}></i>
                  <h5 className="optionTitle" onClick={handleLogout}>
                    Log Out
                  </h5>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
