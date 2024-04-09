import React, { useState } from "react";
import { Country, State, City } from "country-state-city";

function SelectLocation(props) {
  const { setLocation } = props;
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [city, setCity] = useState("");

  let tempCountries = countries.slice(0, 11);

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
                ? State.getStateByCodeAndCountry(stateCode, countryCode).name
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
      </div>
    </>
  );
}

export default SelectLocation;
