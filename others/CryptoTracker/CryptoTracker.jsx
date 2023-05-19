import React from "react";
import { Select , Table,  Space} from "antd";

const columns = [
  {
    title: 'Coin Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => {
      return<a>{text}</a>},
  },
  {
    title: 'Current Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '% Change',
    dataIndex: 'perChange',
    key: 'perChange',
  },
  
  {
    title: 'Market Capital',
    key: 'mrktCap',
    dataIndex: 'mrktCap',
    // render: () =>  {return <span>{}</span> },
  },
];
const data = [
  {
    key: '1',
    name: 'Bitcoin',
    price: 32,
    perChange: 2.4,
    mrktCap: 234,
  },
  {
    key: '2',
    name: 'You Coin',
    price: 42,
    perChange: 2.4,
    mrktCap: 234,
  },
  {
    key: '3',
    name: 'Me Coin',
    price: 32,
    perChange: 2.4,
    mrktCap: 234,
  },
];






const CryptoTracker = () => {
  return (
    <div>
      <div className="search">
        <input placeholder="Enter the coin name"/>
        <div className="dropdownBar">
          <Select
            defaultValue="Current Price"
          >
            <Select.Option value="Current Price  ">Current Price</Select.Option>
            <Select.Option value="Lowest First">Lowest First</Select.Option>
            <Select.Option value="Highest First">Highest First</Select.Option>
          </Select>
          <Select
            defaultValue="% Change"
          >
            <Select.Option value="% Change  ">% Change</Select.Option>
            <Select.Option value="Lowest First">Lowest First</Select.Option>
            <Select.Option value="Highest First">Highest First</Select.Option>
          </Select>
          <Select
            defaultValue="Market Capital"
          >
            <Select.Option value="Market Capital  ">Market Capital</Select.Option>
            <Select.Option value="Lowest First">Lowest First</Select.Option>
            <Select.Option value="Highest First">Highest First</Select.Option>
          </Select>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CryptoTracker;
