import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function CompanyJobs(props) {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [jobId, setJobId] = useState();

  const navigate = useNavigate();
  const ref = useRef(null);

  const changeStatus = async (status, id, jobId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/changeStatus`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          status: status,
          id: id,
          jobId: jobId,
        }),
      }
    );
    const json = await response.json();
    if (json.success === true) {
      props.showAlert("Status updated successfully.", "success");
    } else {
      props.showAlert("Some error occured.", "failure");
    }
  };

  const openModal = async (applicants, id) => {
    setJobId(id);
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
          style={{ position: "absolute", top: "14%", left: "20%" }}
        >
          <div className="modal-content" style={{ width: "70vw" }}>
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
                        <td>
                          <img
                            src={student.pictureLink}
                            alt="Student profile"
                            height={"50px"}
                          />
                        </td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>{student.location}</td>
                        <td>
                          <a href={student.resumeLink} target="_blank">
                            <button className="btn btn-md btn-success">
                              Resume
                            </button>
                          </a>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => {
                                changeStatus("accept", student._id, jobId);
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-sm btn-danger mx-2"
                              onClick={() => {
                                changeStatus("reject", student._id, jobId);
                              }}
                            >
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
                        openModal(job.applicants, job._id);
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
