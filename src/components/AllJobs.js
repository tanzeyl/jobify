import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AllJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

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

    for (let i = 0; i < jobs.length; i++) {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/getCompany`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            companyID: jobs[i].company,
          }),
        }
      );
      const json = await response.json();
      let c = companies;
      c.push(json.company);
      console.log(typeof c);
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

  return (
    <>
      <div className="allJobs">
        {jobs.map((job, index) => {
          console.log(jobs[0].company);
          return (
            <div className="job">
              <h1>{job.roleName}</h1>
              <p>{job.location}</p>
              <p>{job.minCTC}</p>
              <p>{job.maxCTC}</p>
              <p>{job.company}</p>
              <p>{companies.name}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AllJobs;
