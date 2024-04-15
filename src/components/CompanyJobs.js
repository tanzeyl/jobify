import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function CompanyJobs() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const navigate = useNavigate();
  const ref = useRef(null);

  const openModal = async (applicants) => {
    let tempApplicants = [];
    for (let i = 0; i < applicants.length; i++) {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/getApplicantDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            studentId: applicants[i],
          }),
        }
      );
      const json = await response.json();
      tempApplicants.push(json.student);
    }
    setApplicants(tempApplicants);
    ref.current.click();
  };

  const getJobs = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/allPostedJobs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setJobs(json.jobs);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getJobs();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog"
          style={{ position: "absolute", top: "14%", left: "25%" }}
        >
          <div className="modal-content" style={{ width: "60vw" }}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                <div className="d-flex align-items-center">Applicants</div>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-responsive table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Profile Picture</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Resume</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((student, index) => {
                    return (
                      <tr key={index}>
                        <td>{student.pictureLink}</td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.location}</td>
                        <td>
                          <button className="btn btn-md btn-success">
                            Resume
                          </button>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button className="btn btn-sm btn-success">
                              Accept
                            </button>
                            <button className="btn btn-sm btn-danger mx-2">
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* <div className="modal-footer">
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
            </div> */}
          </div>
        </div>
      </div>
      <div className="tableContainer mt-4">
        <table className="table table-responsive table-bordered table-hover">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Location</th>
              <th>Minimum CTC</th>
              <th>Maximum CTC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => {
              return (
                <tr key={index}>
                  <td>{job.roleName}</td>
                  <td>{job.location}</td>
                  <td>{job.minCTC}</td>
                  <td>{job.maxCTC}</td>
                  <td>
                    <button
                      className="btn btn-md btn-success"
                      onClick={() => {
                        openModal(job.applicants);
                      }}
                    >
                      View Applicants
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CompanyJobs;
