import { React, useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

// https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=100&page=1&sparkline=false"

const CryptoTable = () => {
  const [inputVal, setInputVal] = useState("");
  const [cryptoDataFromApi, setCryptoDataFromApi] = useState([]);
  //   const [apiData, setApiData] = useState([]);

  useEffect(() => {
    getApiCryptoData();
  }, []);

  const handleChange = (e) => {
    setInputVal(e.target.value);
  };

  const getApiCryptoData = async () => {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );

    const allCoinDataObj = data.map((currCoinData) => {
      console.log(currCoinData, "i m currdata");
      return currCoinData;
    });
    setCryptoDataFromApi(allCoinDataObj);
    // setApiData(allCoinDataObj);
    console.log(allCoinDataObj);

    // console.log(cryptoDataFromApi, "new data");
  };
  const dataSource = cryptoDataFromApi.map((currCoinData) => {
    return {
      coinName: currCoinData.name,
      key: currCoinData.id,
      img: currCoinData.image,
      currentPrice: currCoinData.current_price,
      marketCapital: currCoinData.market_cap,
    };
  });
  const columns = [
    {
      title: "Coin Name",
      dataIndex: "coinName",
      key: "name",
    },
    {
      title: "Current Price",
      dataIndex: "currentPrice",
      key: "price",
    },
    {
      title: "Market Capital",
      dataIndex: "marketCapital",
      key: "marketCapital",
    },
  ];

  return (
    <div>
      <input
        type="search"
        placeholder="Search Coin"
        value={inputVal}
        onChange={handleChange}
      />
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};
export default CryptoTable;
