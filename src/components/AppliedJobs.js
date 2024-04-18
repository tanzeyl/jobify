import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AppliedJobs() {
  document.title = "Jobify - Applied Jobs";
  const navigate = useNavigate();
  const [applied, setApplied] = useState([]);
  const [status, setStatus] = useState([]);
  let i = -1;

  const getAppliedJobs = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/auth/appliedJobs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    setApplied(json.appliedJobs);
    setStatus(json.status);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAppliedJobs();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="tableContainer mt-4">
        <table className="table table-responsive table-bordered table-hover">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Location</th>
              <th>Minimum CTC</th>
              <th>Maximum CTC</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applied.map((job, index) => {
              i++;
              return (
                <tr key={index}>
                  <td>{job.roleName}</td>
                  <td>{job.location}</td>
                  <td>{job.minCTC}</td>
                  <td>{job.maxCTC}</td>
                  <td>
                    <button
                      className={`btn btn-md btn-${
                        status[i].status === "rejected" ? "danger" : "success"
                      }`}
                    >
                      {status[i].status.toUpperCase()}
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

export default AppliedJobs;
