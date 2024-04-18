import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import SelectLocation from "./SelectLocation";

function CompanyProfile() {
  document.title = "Jobify - Student Details";

  const navigate = useNavigate();
  const ref = useRef(null);
  const refClose = useRef(null);

  const [profile, setProfile] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    pictureLink: "",
    resumeLink: "",
    balance: 0,
  });

  const openModal = () => {
    ref.current.click();
  };

  const onChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const previewFiles = async (file, type, flag) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (type === "student") {
        if (flag === 0) {
          setResume(reader.result);
        } else {
          setProfile(reader.result);
        }
      }
    };
  };

  const onResumeChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file, "student", 0);
  };

  const onProfileChange = (e) => {
    const file = e.target.files[0];
    previewFiles(file, "student", 1);
  };

  const handleClick = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/addStudentDetails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          phone: details.phone,
          location: location,
          resume: resume,
          profile: profile,
        }),
      }
    );
    const json = await response.json();
    if (json.success === true) {
      setDetails(json.details);
    }
    setLoading(false);
    refClose.current.click();
  };

  const getUserDetails = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/getStudentDetails`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setDetails(json.student);
    setLocation(json.student.location);
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
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                <div className="d-flex align-items-center">
                  Edit Details {loading && <Spinner />}
                </div>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={details.name}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={details.email}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={details.phone}
                    onChange={onChange}
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
                  <label htmlFor="resume" className="form-label">
                    Update Resume
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="resume"
                    id="resume"
                    onChange={onResumeChange}
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="picture" className="form-label">
                    Update Profile Picture
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="picture"
                    id="picture"
                    onChange={onProfileChange}
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
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="profileContainer mt-1">
        <div className="companyLogo">
          <img
            className="img img-fluid companyProfileImage"
            src={details.pictureLink}
            alt="Company Logo"
          />
          <div className="companyDetails">
            <button className="btn btn-md btn-success mb-4" onClick={openModal}>
              Edit details
            </button>
            <button
              type="button"
              className="btn btn-primary d-none"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              ref={ref}
            >
              Launch demo modal
            </button>
            <div className="mb-3">
              <label htmlFor="balance" className="form-label">
                Current Balance
              </label>
              <input
                type="text"
                className="form-control"
                id="balance"
                name="balance"
                value={details.balance}
                disabled
              />
            </div>
            <Link to="/paymentForm">
              <button className="btn btn-md btn-success mb-2">
                Buy more coins
              </button>
            </Link>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Student Name
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
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="wesbite"
                value={details.email}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={details.phone}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={location}
                disabled
              />
            </div>
            <a href={details.resumeLink} target="_blank">
              <button className="btn btn-lg btn-success mb-4">
                View Resume
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyProfile;
