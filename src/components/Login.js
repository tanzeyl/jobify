import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  document.title = "Jobify - Log In!";
  const navigate = useNavigate();

  const [type, setType] = useState("company");
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  if (localStorage.getItem("token")) {
    navigate("/companyProfile");
  }

  const selectType = (e) => {
    setType(e.target.value);
  };

  const onChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type === "company") {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/companyLogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: details.email,
              password: details.password,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("token", data.authtoken);
          localStorage.setItem("userType", "company");
          navigate("/companyProfile");
        }
      } catch (error) {
        console.error("Error saving user profile:", error);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/studentLogin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: details.email,
              password: details.password,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("token", data.authtoken);
          localStorage.setItem("userType", "student");
          navigate("/studentProfile");
        }
      } catch (error) {
        console.error("Error saving user profile:", error);
      }
    }
  };

  return (
    <>
      <div className="loginContainer">
        <select className="form-select mt-2" value={type} onChange={selectType}>
          <option value="company">Company</option>
          <option value="student">Student</option>
        </select>
        <form
          className="companySignup mt-2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              onChange={onChange}
            />
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
              onChange={onChange}
            />
          </div>
          <div className="d-flex justify-content-start">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
