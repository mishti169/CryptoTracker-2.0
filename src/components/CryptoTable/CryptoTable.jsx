import { React, useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

const CryptoTable = () => {
  const [inputVal, setInputVal] = useState("");
  const [dataSource, setDataSource] = useState([]);

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

    const allCoinDataArr = data.map((currCoinData) => {
      console.log(currCoinData, "i m currdata");
      return {
        coinName: currCoinData.name,
        key: currCoinData.id,
        img: currCoinData.image,
        currentPrice: currCoinData.current_price,
        marketCapital: currCoinData.market_cap,
      };
    });
    setDataSource(allCoinDataArr);
  };

  const columns = [
    {
      title: "Coin Name",
      dataIndex: "coinName",
      key: "name",
      render: (_, currCoin) => {
        console;
        return (
          <div>
            <div>
              <img src={currCoin.img} alt="coinImage" width={34} />
              <span>{currCoin.coinName}</span>
            </div>
          </div>
        );
      },
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
