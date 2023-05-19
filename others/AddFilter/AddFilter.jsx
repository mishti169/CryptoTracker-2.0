import { React, useState, useEffect } from "react";
import axios from "axios";

const AddFilter = () => {
  const [countryNames, setCountryNames] = useState([""]);
  const [inputVal, setInputVal] = useState("");
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterCountryNames();
  }, [inputVal]);

  const getData = async () => {
    const { data } = await axios.get("https://restcountries.com/v3.1/all");

    const countryNamesArr = data.map((currentCountry) => {
      return currentCountry.name.common;
    });
    setCountryNames(countryNamesArr);
    setApiData(countryNamesArr);
  };

  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  const filterCountryNames = () => {
    console.log("im filtering");
    const filteredCountryName = apiData.filter((currCountryName) => {
      return currCountryName.toLowerCase().includes(inputVal.toLowerCase());
    });
    console.log(filteredCountryName);
    setCountryNames(filteredCountryName);
  };

  return (
    <div>
      <input
        type="search"
        placeholder="Search Any Country"
        value={inputVal}
        onChange={handleChange}
        autoFocus
      />
      <ol>
        {countryNames.map((currCountry) => {
          return <li>{currCountry}</li>;
        })}
      </ol>
    </div>
  );
};
export default AddFilter;
