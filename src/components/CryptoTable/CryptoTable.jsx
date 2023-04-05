import { React, useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal } from "antd";

const CryptoTable = () => {
  const [inputVal, setInputVal] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalSelectedCoin, setModalSelectedCoin] = useState({});

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
      return {
        coinName: currCoinData.name,
        key: currCoinData.id,
        img: currCoinData.image,
        currentPrice: currCoinData.current_price,
        marketCapital: currCoinData.market_cap,
        change: Number(currCoinData.price_change_percentage_24h.toFixed(2)),
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
    {
      title: "% Change",
      dataIndex: "change",
      key: "change",
    },
  ];

  const showModal = (record) => {
    console.log(record, "showmodal no record");
    setIsOpen(true);
    setModalSelectedCoin(record);
  };
  const handleCancel = () => {
    setIsOpen(false);
  };
  const handleOk = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <input
        type="search"
        placeholder="Search Coin"
        value={inputVal}
        onChange={handleChange}
      />
      <Table
        onRow={(record) => {
          //   console.log(record, "im log");
          return {
            onClick: () => {
              showModal(record);
              console.log(record, "im record");
            },
          };
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <Modal
        title="Coin Details Modal"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div>
          <img src={modalSelectedCoin.img} width={180} />
          <div>
            <h2>{modalSelectedCoin.coinName}</h2>
            <h3>Current Price:{modalSelectedCoin.currentPrice}</h3>
            <h3>Market Capital:{modalSelectedCoin.marketCapital}</h3>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CryptoTable;
