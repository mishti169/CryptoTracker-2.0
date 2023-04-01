import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table } from "antd";

const SimpleTable = () => {
  const [countryNames, setCountryNames] = useState([]);
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
    // const countryNamesArr = data.map((currentCountry) => { // cna  = [{},{},{}]
    //   return currentCountry;
    // });
    setCountryNames(data);
    setApiData(data);
  };

  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  const filterCountryNames = () => {
    const filteredCountryName = apiData.filter((currCountryObj) => {
      return currCountryObj.name.common
        .toLowerCase()
        .includes(inputVal.toLowerCase());
    });
    setCountryNames(filteredCountryName);
  };

  const dataSource = countryNames.map((currCountry, index) => {
    // return <li>{currCountry}</li>;
    // const ans = cuObj && cuObj.name;
    let currency = "";

    if (currCountry.currencies) {
      const cuObj = Object.values(currCountry.currencies)[0];
      if (cuObj) {
        currency = cuObj.name;
      }
    } else {
    }

    return {
      key: index,
      countryName: currCountry.name.common,
      flag: currCountry.flag,
      capital: currCountry.capital,
      currency: currency,
    };
  });

  const columns = [
    {
      title: "Country Name",
      dataIndex: "countryName",
      key: "name",
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Capital",
      dataIndex: "capital",
      key: "capital",
    },
  ];

  return (
    <div>
      <input
        type="search"
        placeholder="Search Any Country"
        value={inputVal}
        onChange={handleChange}
        autoFocus
      />
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      {/* <ol>
        {countryNames.map((currCountry) => {
          return <li>{currCountry}</li>;
        })}
      </ol> */}
    </div>
  );
};
export default SimpleTable;
