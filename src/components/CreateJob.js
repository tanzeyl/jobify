import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import "../App.css";

function CreateJob(props) {
  const navigate = useNavigate();

  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState({
    roleName: "",
    minCTC: "",
    maxCTC: "",
    duration: "",
    openings: "",
    startDate: "",
  });
  let tempCountries = countries.slice(0, 11);

  const createJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/createJob`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({
            roleName: details.roleName,
            location: location,
            minCTC: details.minCTC,
            maxCTC: details.maxCTC,
            duration: details.duration,
            openings: details.openings,
            startDate: details.startDate,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        navigate("/allPostedJobs");
        props.showAlert("Job created.", "success");
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const onChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const onCountryChange = (e) => {
    let filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(e.target.value)
    );
    setCountries(filteredCountries);
    tempCountries = countries.slice(0, 11);
  };

  const onStateChange = (e) => {
    let filteredStates = states.filter((state) =>
      state.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setStates(filteredStates);
  };

  const onCityChange = (e) => {
    let filteredCities = cities.filter((city) =>
      city.name.toLowerCase().includes(e.target.value)
    );
    setCities(filteredCities);
  };

  const handleState = (isoCode) => {
    setCountryCode(isoCode);
    setStates(State.getStatesOfCountry(isoCode));
  };

  const handleCity = (countryCode, stateCode) => {
    setStateCode(stateCode);
    setCities(City.getCitiesOfState(countryCode, stateCode));
  };

  const setInput = (countryCode, stateCode, cityName) => {
    setLocation(
      `${Country.getCountryByCode(countryCode).name}, ${
        State.getStateByCodeAndCountry(stateCode, countryCode).name
      }, ${cityName}`
    );
    setCity(cityName);
  };

  const handleCountryBackspace = (e) => {
    if (e.keyCode === 8) {
      setCountries(Country.getAllCountries());
    }
  };

  const handleStateBackspace = (e) => {
    if (e.keyCode === 8) {
      setStates(State.getStatesOfCountry(countryCode));
    }
  };

  const handleCityBackspace = (e) => {
    if (e.keyCode === 8) {
      setCities(City.getCitiesOfState(countryCode, stateCode));
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center">
        <form
          className="companySignup createJobContainer mt-2"
          onSubmit={createJob}
        >
          <div className="mb-3">
            <label htmlFor="roleName" className="form-label">
              Role Name
            </label>
            <input
              type="text"
              className="form-control"
              id="roleNAme"
              name="roleName"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="duration" className="form-label">
              Duration in Months
            </label>
            <input
              type="text"
              className="form-control"
              id="duration"
              name="duration"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="openings" className="form-label">
              Number of openings
            </label>
            <input
              type="number"
              className="form-control"
              id="openings"
              name="openings"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              name="startDate"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <div className="d-flex">
              <div className="dropdown">
                <button
                  className="btn btn-outline dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {countryCode.length > 0
                    ? Country.getCountryByCode(countryCode).name
                    : "Country"}
                </button>
                <ul className="dropdown-menu" style={{ overflow: "scroll" }}>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      onChange={onCountryChange}
                      onKeyDown={handleCountryBackspace}
                    />
                  </li>
                  {tempCountries.map((item, index) => {
                    return (
                      <li
                        className="dropdown-item"
                        key={index}
                        onClick={() => {
                          handleState(item.isoCode);
                        }}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-outline dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {stateCode.length > 0
                    ? State.getStateByCodeAndCountry(stateCode, countryCode)
                        .name
                    : "State"}
                </button>
                <ul className="dropdown-menu" style={{ overflow: "scroll" }}>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      onChange={onStateChange}
                      onKeyDown={handleStateBackspace}
                    />
                  </li>
                  {states.map((item, index) => {
                    return (
                      <li
                        className="dropdown-item"
                        key={index}
                        onClick={() => {
                          handleCity(countryCode, item.isoCode);
                        }}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-outline dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {city.length > 0 ? city : "City"}
                </button>
                <ul className="dropdown-menu" style={{ overflow: "scroll" }}>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      onChange={onCityChange}
                      onKeyDown={handleCityBackspace}
                    />
                  </li>
                  {cities.map((item, index) => {
                    return (
                      <li
                        className="dropdown-item"
                        key={index}
                        onClick={() => {
                          setInput(countryCode, stateCode, item.name);
                        }}
                      >
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <input
              type="text"
              className="form-control"
              disabled={true}
              value={location}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="minCTC" className="form-label">
              Minimum CTC
            </label>
            <input
              type="text"
              className="form-control"
              name="minCTC"
              id="minCTC"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="maxCTC" className="form-label">
              Maximum CTC
            </label>
            <input
              type="text"
              className="form-control"
              name="maxCTC"
              id="maxCTC"
              onChange={onChange}
            />
          </div>
          <div className="d-flex justify-content-start">
            <button type="submit" className="btn btn-primary">
              Create Job
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateJob;
