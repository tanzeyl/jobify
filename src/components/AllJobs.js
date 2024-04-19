import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AllJobs(props) {
  document.title = "Jobify - All Jobs";
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const getJobs = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/viewJobs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setJobs(json.jobs);
  };

  const apply = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/apply/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    if (json.success === true) {
      props.showAlert(json.message, "success");
    } else {
      props.showAlert(json.message, "failure");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getJobs();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    let filteredJobs = jobs.filter((job) => {
      return job.roleName.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setJobs(filteredJobs);
  };

  const handleBackspace = (e) => {
    if (e.keyCode === 8) {
      getJobs();
      let filteredJobs = jobs.filter((job) => {
        return job.roleName
          .toLowerCase()
          .includes(document.getElementById("search").value.toLowerCase());
      });
      setJobs(filteredJobs);
    }
  };

  return (
    <>
      <div className="mt-4 searchBox">
        <input
          id="search"
          type="text"
          className="form-control"
          name="search"
          placeholder="Search by Job Title"
          onChange={onChange}
          onKeyDown={handleBackspace}
        />
      </div>
      <div className="allJobs">
        {jobs.map((job, index) => {
          return (
            <div className="job" key={index}>
              <div className="jobHeader d-flex align-items-center">
                <a href={job.company.websiteLink}>
                  <img
                    src={job.company.logoLink}
                    alt="Company Logo"
                    height={"100px"}
                  />
                </a>
                <div className="headerDetails mx-4">
                  <h5>
                    {job.roleName} ({job.company.name})
                  </h5>
                  <h6 className="text-body-secondary">
                    <i>{job.location}</i>
                  </h6>
                </div>
              </div>
              <div className="jobDetails d-flex justify-content-center">
                <div className="section">
                  <div className="sectionTitle">
                    <i className="fa-solid fa-money-check-dollar mx-2"></i>
                    Annual Package
                  </div>
                  <div className="sectionDetails mx-2">
                    <i className="fa-solid fa-indian-rupee-sign mx-2"></i>
                    {job.minCTC}LPA-
                    <i className="fa-solid fa-indian-rupee-sign mx-2"></i>
                    {job.maxCTC}
                    LPA
                  </div>
                </div>

                <div className="section">
                  <div className="sectionTitle">
                    <i className="fa-regular fa-clock mx-2"></i>
                    Duration
                  </div>
                  <div className="sectionDetails mx-3">
                    {job.duration} months
                  </div>
                </div>

                <div className="section">
                  <div className="sectionTitle">
                    <i className="fa-regular fa-calendar mx-2"></i>
                    Start Date
                  </div>
                  <div className="sectionDetails mx-3">
                    {job.startDate.slice(0, 10)}
                  </div>
                </div>

                <div className="section endSection">
                  <div className="sectionTitle">#Openings</div>
                  <div className="sectionDetails mx-3">{job.openings}</div>
                </div>
              </div>
              <center>
                <button
                  className="btn btn-lg btn-outline-info mt-4"
                  onClick={() => {
                    apply(job._id);
                  }}
                >
                  Apply
                </button>
              </center>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AllJobs;
