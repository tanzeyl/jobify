import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleLogo from "../styles/images/google.png";
import Spinner from "./Spinner";
import SelectLocation from "./SelectLocation";

function Signup() {
  const navigate = useNavigate();

  if (localStorage.getItem("token")) {
    navigate("/companyProfile");
  }

  document.title = "Jobify - Sign Up!";

  const [location, setLocation] = useState("");
  const [type, setType] = useState("company");
  const [image, setImage] = useState("");
  const [resume, setResume] = useState("");
  const [profile, setProfile] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyFlag, setCompanyFlag] = useState(true);
  const [studentFlag, setstudentFlag] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    website: "",
    email: "",
    teamSize: "",
    password: "",
  });
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const selectType = (e) => {
    setType(e.target.value);
    setCompanyFlag(!companyFlag);
    setstudentFlag(!studentFlag);
  };

  const onCompanyChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const onStudentChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const previewFiles = async (file, type, flag) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (type === "company") {
        setImage(reader.result);
      } else if (type === "student") {
        if (flag === 0) {
          setResume(reader.result);
        } else {
          setProfile(reader.result);
        }
      }
    };
  };

  const onCompanyFileChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file, "company", 0);
  };

  const onStudentResumeChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file, "student", 0);
  };

  const onStudentProfileChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file, "student", 1);
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
        localStorage.setItem("userType", "company");
        setLoading(false);
        navigate("/companyProfile");
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/studentSignup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: student.name,
            email: student.email,
            password: student.password,
            phone: student.phone,
            location: location,
            resume: resume,
            picture: profile,
          }),
        }
      );
      setLoading(false);
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.authtoken);
        localStorage.setItem("userType", "student");
        navigate("/studentProfile");
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
            {companyFlag && (
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
                      alt="Logo"
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
            {studentFlag && (
              <form
                className="companySignup mt-2"
                onSubmit={handleStudentSubmit}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={onStudentChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="website" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={onStudentChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    id="phone"
                    onChange={onStudentChange}
                  />
                </div>
                <SelectLocation setLocation={setLocation} />
                <input
                  type="text"
                  className="form-control"
                  disabled={true}
                  value={location}
                />
                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="resume"
                    id="resume"
                    onChange={onStudentResumeChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="picture"
                    id="picture"
                    onChange={onStudentProfileChange}
                    accept=".jpg,.png,.jpeg,.webp,.svg,.ico,.jfif"
                  />
                  {profile && (
                    <img
                      className="img img-fluid mt-4"
                      src={profile}
                      width={200}
                      height={200}
                      alt="Logo"
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
                    onChange={onStudentChange}
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
