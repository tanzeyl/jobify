import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CompanyProfile() {
  document.title = "Jobify - Company Details";

  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: "",
    websiteLink: "",
    email: "",
    teamSize: "",
    logoLink: "",
  });

  const getUserDetails = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/companyProfile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setDetails(json.company);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserDetails();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="profileContainer mt-4">
        <div className="companyLogo">
          <img
            className="img img-fluid companyProfileImage"
            src={details.logoLink}
            alt="Company Logo"
          />
          <div className="companyDetails">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Company Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={details.name}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="website" className="form-label">
                Website Link
              </label>
              <input
                type="text"
                className="form-control"
                id="wesbite"
                value={details.websiteLink}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={details.email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="teamSize" className="form-label">
                Team Size
              </label>
              <input
                type="text"
                className="form-control"
                id="teamSize"
                value={details.teamSize}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyProfile;
