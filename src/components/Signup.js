import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../styles/images/google.png";
import Spinner from "./Spinner";

function Signup() {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    navigate("/companyProfile");
  }
  document.title = "Jobify - Sign Up!";
  const [type, setType] = useState("company");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    website: "",
    email: "",
    teamSize: "",
    password: "",
  });
  const [logo, setLogo] = useState(null);

  const selectType = (e) => {
    setType(e.target.value);
  };

  const onCompanyChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const previewFiles = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const onCompanyFileChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);
    previewFiles(file);
    console.log(file);
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/createCompany`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: details.name,
            websiteLink: details.website,
            email: details.email,
            teamSize: details.teamSize,
            password: details.password,
            logo: image,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.authtoken);
        setLoading(false);
        navigate("/companyProfile");
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  return (
    <>
      <div className="signupContainer">
        <div className="d-flex">
          <div className="col-md-4 signupLeft">
            <button
              className="googleBtn"
              onClick={() => {
                alert("This is to be implemented.");
              }}
            >
              <img src={googleLogo} alt="google icon" />
              <span>Sign up with Google</span>
            </button>
          </div>
          <div className="separator"></div>
          <div className="col-md-7 signupRight">
            <select
              className="form-select mt-2"
              value={type}
              onChange={selectType}
            >
              <option value="company">Company</option>
              <option value="student">Student</option>
            </select>
            {type === "company" && (
              <form
                className="companySignup mt-2"
                onSubmit={handleCompanySubmit}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={onCompanyChange}
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
                    name="website"
                    onChange={onCompanyChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    onChange={onCompanyChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="teamSize" className="form-label">
                    Team Size
                  </label>
                  <select
                    className="form-select"
                    name="teamSize"
                    onChange={onCompanyChange}
                  >
                    <option selected value="10 or less">
                      10 or less
                    </option>
                    <option value="11-15">11-15</option>
                    <option value="16-30">16-30</option>
                    <option value="30+">30+</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">
                    Upload Company Logo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="logo"
                    id="logo"
                    onChange={onCompanyFileChange}
                  />
                  {image && (
                    <img
                      className="img img-fluid mt-4"
                      src={image}
                      width={200}
                      height={200}
                    />
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={onCompanyChange}
                  />
                </div>
                <div className="d-flex justify-content-start">
                  <button type="submit" className="btn btn-primary">
                    Create Account
                  </button>
                  {loading && <Spinner />}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
