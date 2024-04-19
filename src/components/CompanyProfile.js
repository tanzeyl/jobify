import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "./Spinner";

function CompanyProfile(props) {
  document.title = "Jobify - Company Details";

  const navigate = useNavigate();
  const ref = useRef(null);
  const refClose = useRef(null);

  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    websiteLink: "",
    email: "",
    teamSize: "",
    logoLink: "",
  });

  const openModal = () => {
    ref.current.click();
  };

  const onChange = (e) => {
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
    previewFiles(file);
  };

  const handleClick = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/updateCompanyDetails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: details.name,
          websiteLink: details.websiteLink,
          email: details.email,
          teamSize: details.teamSize,
          logo: image,
        }),
      }
    );
    const json = await response.json();
    if (json.success === true) {
      if (json.details.logoLink) {
        setDetails(json.details);
      } else {
        let newDetails = json.details;
        newDetails.logoLink = details.logoLink;
        setDetails(newDetails);
      }
    }
    setLoading(false);
    props.showAlert("Details updated successfully.", "success");
    refClose.current.click();
  };

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
                    Name
                  </label>
                  <input
                    value={details.name}
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="websiteLink" className="form-label">
                    Website Link
                  </label>
                  <input
                    value={details.websiteLink}
                    type="text"
                    className="form-control"
                    id="websiteLink"
                    name="websiteLink"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    value={details.email}
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="teamSize" className="form-label">
                    Team Size
                  </label>
                  <select className="form-select" name="teamSize">
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
      <div className="profileContainer mt-4">
        <div className="companyLogo">
          <img
            className="img img-fluid companyProfileImage"
            src={details.logoLink}
            alt="Company Logo"
          />
          <div className="companyDetails mb-4">
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
