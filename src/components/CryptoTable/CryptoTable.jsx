import { React, useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Select } from "antd";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import FusionCharts from "fusioncharts";
import ReactFusioncharts from "react-fusioncharts";
import { fromUnixTime, getTime, getUnixTime, sub, format } from "date-fns";
ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);

const CryptoTable = () => {
  const [inputVal, setInputVal] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [modalSelectedCoin, setModalSelectedCoin] = useState({});
  const [apiData, setApiData] = useState([]);
  const [timeRange, setTimeRange] = useState("");
  const [chartData, setChartData] = useState({});

  const chartDataSource = {
    chart: {
      caption: "Price changes",
      yaxisname: "price",
      xaxisname: "time",
      subcaption: "",
      rotatelabels: "1",
      setadaptiveymin: "1",
      theme: "fusion",
    },
    data: chartData,
  };
  const getFromTimeStamp = (timeRange) => {
    if (timeRange === "7D") {
      const ans = sub(new Date(), { weeks: 1 });
      return getUnixTime(ans);
    } else if (timeRange === "1M") {
      const ans = sub(new Date(), { months: 1 });
      return getUnixTime(ans);
    } else if (timeRange === "3M") {
      const ans = sub(new Date(), { months: 3 });
      return getUnixTime(ans);
    } else if (timeRange === "6M") {
      const ans = sub(new Date(), { months: 6 });
      return getUnixTime(ans);
    } else if (timeRange === "1Y") {
      const ans = sub(new Date(), { years: 1 });
      return getUnixTime(ans);
    } else if (timeRange === "3y") {
      const ans = sub(new Date(), { years: 3 });
      return getUnixTime(ans);
    } else {
      const ans = sub(new Date(), { days: 1 });
      return getUnixTime(ans);
    }
  };
  useEffect(() => {
    getApiCryptoData();
  }, []);

  useEffect(() => {
    filterCoinData();
  }, [inputVal]);

  useEffect(() => {
    if (timeRange) {
      getApiChartData(modalSelectedCoin.key);
    }
  }, [timeRange]);

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
    setApiData(allCoinDataArr);
  };
  const filterCoinData = () => {
    const filteredCoinData = apiData.filter((currentCoinData) => {
      return currentCoinData.coinName
        .toLowerCase()
        .includes(inputVal.toLowerCase());
    });
    setDataSource(filteredCoinData);
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

  const getDateTimeFromTimeStamp = (timeStamp) => {
    const dateObj = fromUnixTime(parseInt(timeStamp / 1000));
    return format(dateObj, "dd/MM/yyyy HH:mm:ss");
  };
  const getApiChartData = async (coin) => {
    const toTimeStamp = getUnixTime(new Date());
    const fromTimeStamp = getFromTimeStamp(timeRange.value);

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=usd&from=${fromTimeStamp}&to=${toTimeStamp}`
    );
    const newConvertedData = data.prices.map((currItem) => {
      const [timeStamp, price] = currItem;
      const dateTime = getDateTimeFromTimeStamp(timeStamp);
      return {
        label: dateTime,
        value: price,
      };
    });
    setChartData(newConvertedData);
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
          return {
            onClick: () => {
              showModal(record);
              getApiChartData(record.key);
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
        <div>
          <Select
            labelInValue
            defaultValue={[
              {
                value: "1D",
                label: "1D ",
              },
            ]}
            style={{
              width: 120,
            }}
            onChange={(value) => {
              setTimeRange(value);
            }}
            options={[
              {
                value: "1D",
                label: "1D",
              },
              {
                value: "7D",
                label: "7D",
              },
              {
                value: "1M",
                label: "1M",
              },
              {
                value: "3M",
                label: "3M",
              },
              {
                value: "6M",
                label: "6M",
              },
              {
                value: "1Y",
                label: "1Y",
              },
              {
                value: "3Y",
                label: "3Y",
              },
            ]}
          />
        </div>
        <div>
          <ReactFusioncharts
            type="line"
            width="100%"
            height="100%"
            dataFormat="JSON"
            dataSource={chartDataSource}
          />
        </div>
      </Modal>
    </div>
  );
};
export default CryptoTable;
