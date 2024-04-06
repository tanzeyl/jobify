import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const [closed, setClosed] = useState(false);
  const navigate = useNavigate();

  const closeSidebar = () => {
    let sidebar = document.getElementsByClassName("Sidebar")[0];
    if (closed === false) {
      sidebar.style.width = "60px";
      setClosed(true);
    } else {
      sidebar.style.width = "250px";
      setClosed(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  return (
    <>
      <div className="Sidebar">
        <div className="closeButton">
          {!closed && (
            <i className="fa-solid fa-x close" onClick={closeSidebar}></i>
          )}
          {closed && (
            <i
              className="fa-solid fa-arrow-right-to-bracket"
              onClick={closeSidebar}
            ></i>
          )}
        </div>
        <div className="menu">
          <div className="menuOptions">
            {!localStorage.getItem("token") && (
              <div className="option">
                {closed && (
                  <Link className="nav-link optionContent" to="/signup">
                    <i className="fa-solid fa-user-plus"></i>
                  </Link>
                )}
                {!closed && (
                  <Link className="nav-link optionContent" to="/signup">
                    <i className="fa-solid fa-user-plus"></i>
                    <h5 className="optionTitle">Sign Up</h5>
                  </Link>
                )}
              </div>
            )}

            {!localStorage.getItem("token") && (
              <div className="option">
                {closed && (
                  <Link className="nav-link optionContent" to="/login">
                    <i className="fa-solid fa-mobile"></i>
                  </Link>
                )}
                {!closed && (
                  <Link className="nav-link optionContent" to="/login">
                    <i className="fa-solid fa-mobile"></i>
                    <h5 className="optionTitle">Log In</h5>
                  </Link>
                )}
              </div>
            )}

            {localStorage.getItem("token") && (
              <div className="option">
                {closed && (
                  <Link className="nav-link optionContent" to="">
                    <i
                      className="fa-solid fa-mobile"
                      onClick={handleLogout}
                    ></i>
                  </Link>
                )}
                {!closed && (
                  <Link className="nav-link optionContent" to="">
                    <i
                      className="fa-solid fa-mobile"
                      onClick={handleLogout}
                    ></i>
                    <h5 className="optionTitle" onClick={handleLogout}>
                      Log Out
                    </h5>
                  </Link>
                )}
              </div>
            )}

            <div className="option">
              {closed && (
                <Link className="nav-link optionContent" to="/">
                  <i className="fa-solid fa-address-card"></i>
                </Link>
              )}
              {!closed && (
                <Link className=" nav-link optionContent" to="/">
                  <i className="fa-solid fa-address-card"></i>
                  <h5 className="optionTitle">About Us</h5>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
