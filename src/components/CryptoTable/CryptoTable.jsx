import { React, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Modal, Select } from 'antd';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import FusionCharts from 'fusioncharts';
import ReactFusioncharts from 'react-fusioncharts';
import { fromUnixTime, getTime, getUnixTime, sub, format } from 'date-fns';
import './CryptoTable.scss';
ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);

const CryptoTable = () => {
	const [inputVal, setInputVal] = useState('');
	const [dataSource, setDataSource] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [modalSelectedCoin, setModalSelectedCoin] = useState({});
	const [apiData, setApiData] = useState([]);
	const [timeRange, setTimeRange] = useState('1D');
	const [chartData, setChartData] = useState({});
	const [currPrice, setCurrPrice] = useState('currPrice');
	const [mktCap, setMktCap] = useState('marketCapital');
	const [perChange, setPerChange] = useState('%Change');

	const chartDataSource = {
		chart: {
			caption: 'Price changes',
			yaxisname: 'price',
			xaxisname: 'time',
			subcaption: '',
			// rotatelabels: '1',
			setadaptiveymin: '1',
			theme: 'fusion',
		},
		data: chartData,
	};
	const getFromTimeStamp = (timeRange) => {
		if (timeRange === '7D') {
			const ans = sub(new Date(), { weeks: 1 });
			return getUnixTime(ans);
		} else if (timeRange === '1M') {
			const ans = sub(new Date(), { months: 1 });
			return getUnixTime(ans);
		} else if (timeRange === '3M') {
			const ans = sub(new Date(), { months: 3 });
			return getUnixTime(ans);
		} else if (timeRange === '6M') {
			const ans = sub(new Date(), { months: 6 });
			return getUnixTime(ans);
		} else if (timeRange === '1Y') {
			const ans = sub(new Date(), { years: 1 });
			return getUnixTime(ans);
		} else if (timeRange === '3y') {
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
	const parseCoinData = (allCoinDataArr) => {
		// get every 12th value for 1day data
		const newDayData = [];
		for (let i = 0; i < allCoinDataArr.length; i += 12) {
			const [, timeStamp] = allCoinDataArr[i].label.split(' ');
			const [hour, min] = timeStamp.split(':');
			// get only timeStamp from date + time
			allCoinDataArr[i].label = `${hour}:${min}`;
			newDayData.push(allCoinDataArr[i]);
		}
		//get only time
		return newDayData;
	};

	const getReadableCurrPrice = (val) => {
		if (val >= 1000000000000) {
			const ans = Number(val / 1000000000000).toFixed(2) + 'T';
			return ans;
		} else if (val >= 1000000000) {
			const ans = Number(val / 1000000000).toFixed(2) + 'B';
			return ans;
		} else if (val >= 1000000) {
			const ans = Number(val / 1000000).toFixed(2) + 'M';
			return ans;
		} else if (val >= 100000) {
			const ans = Number(val / 100000).toFixed(2) + 'L';
			return ans;
		} else if (val >= 1000) {
			const ans = Number(val / 1000).toFixed(2) + 'K';
			return ans;
		} else return val;
	};
	const getApiCryptoData = async () => {
		const { data } = await axios.get(
			'https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=100&page=1&sparkline=false'
		);

		const allCoinDataArr = data.map((currCoinData) => {
			return {
				coinName: currCoinData.name,
				key: currCoinData.id,
				img: currCoinData.image,
				readableCurrentPrice: getReadableCurrPrice(currCoinData.current_price),
				currentPrice: currCoinData.current_price,
				readableMarketCapital: getReadableCurrPrice(currCoinData.market_cap),
				marketCapital: currCoinData.market_cap,
				change: Number(currCoinData.price_change_percentage_24h.toFixed(2)),
			};
		});
		setDataSource(allCoinDataArr);
		setApiData(allCoinDataArr);
	};
	const filterCoinData = () => {
		const filteredCoinData = apiData.filter((currentCoinData) => {
			return currentCoinData.coinName.toLowerCase().includes(inputVal.toLowerCase());
		});
		setDataSource(filteredCoinData);
	};

	const columns = [
		{
			title: 'Coin Name',
			dataIndex: 'coinName',
			key: 'name',
			sorter: (a, b) => a.coinName.length - b.coinName.length,
			render: (_, currCoin) => {
				return (
					<div>
						<div>
							<img src={currCoin.img} alt='coinImage' width={34} />
							<span>{currCoin.coinName}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: 'Current Price',
			dataIndex: 'readableCurrentPrice',
			key: 'price',
			sorter: {
				compare: (a, b) => a.currentPrice - b.currentPrice,
			},
		},
		{
			title: 'Market Capital',
			dataIndex: 'readableMarketCapital',
			key: 'marketCapital',
			sorter: {
				compare: (a, b) => a.marketCapital - b.marketCapital,
			},
		},
		{
			title: '% Change',
			dataIndex: 'change',
			key: 'change',
			sorter: {
				compare: (a, b) => a.change - b.change,
			},
		},
	];

	const showModal = (record) => {
		console.log(record, 'showmodal no record');
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
		return format(dateObj, 'dd/MM/yyyy HH:mm:ss');
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
				tooltext: dateTime,
			};
		});
		const parsedCoinData = parseCoinData(newConvertedData);

		setChartData(parsedCoinData);
	};
	// const onSortChange = (sorter, extra) => {
	//   console.log("hi am sorting ", sorter, extra);
	// };
	const bubbleSort = (dataArr, order, field) => {
		const newDataArr = [...dataArr];
		if (order !== '') {
			newDataArr.sort((a, b) => {
				if (a[field] < b[field]) {
					return -1;
				}
				if (a[field] > b[field]) {
					return 1;
				}
				return 0;
			});
		}

		if (order === 'lowestFirst') {
			setDataSource(newDataArr);
		} else if (order === 'highestFirst') {
			newDataArr.reverse();
			setDataSource(newDataArr);
		} else {
			setDataSource(apiData);
		}
	};
	const onDataChange = (value, field1) => {
		if (value === 'lowest') {
			bubbleSort(dataSource, 'lowestFirst', field1);
		} else if (value === 'highest') {
			bubbleSort(dataSource, 'highestFirst', field1);
		} else {
			bubbleSort(dataSource, '', field1);
		}
	};

	return (
		<div>
			<div className='centered  flex-box  space-between max-width-1200'>
				<input type='search' placeholder='Search Coin' value={inputVal} onChange={handleChange} className='input ' />
				<div>
					<Select
						defaultValue='currPrice'
						value={currPrice}
						style={{
							width: 134,
							margin: '0 10px 0 0',
						}}
						onChange={(value) => {
							onDataChange(value, 'currentPrice');
							console.log(value, ' i m value');
							setCurrPrice(value);
							setMktCap('marketCapital');
							setPerChange('%Change');
						}}
						options={[
							{
								value: 'currPrice',
								label: 'Current Price',
							},
							{
								value: 'highest',
								label: 'Highest First',
							},
							{
								value: 'lowest',
								label: 'Lowest First',
							},
						]}
					/>
					<Select
						defaultValue='marketCapital'
						value={mktCap}
						style={{
							width: 134,
							margin: '0 10px 0 0',
						}}
						onChange={(value) => {
							onDataChange(value, 'marketCapital');
							setMktCap(value);
							setCurrPrice('currentPrice');
							setPerChange('%Change');
						}}
						options={[
							{
								value: 'marketCapital',
								label: 'Market Capital',
							},
							{
								value: 'highest',
								label: 'Highest First',
							},
							{
								value: 'lowest',
								label: 'Lowest First',
							},
						]}
					/>
					<Select
						defaultValue='%Change'
						value={perChange}
						style={{
							width: 134,
						}}
						onChange={(value) => {
							onDataChange(value, 'change');
							setPerChange(value);
							setMktCap('marketCapital');
							setCurrPrice('currentPrice');
						}}
						options={[
							{
								value: '%Change',
								label: '% Change',
							},
							{
								value: 'highest',
								label: 'Highest First',
							},
							{
								value: 'lowest',
								label: 'Lowest First',
							},
						]}
					/>
				</div>
			</div>
			<div className='centered max-width-1200'>
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
					// onChange={onSortChange}
				/>
			</div>
			<Modal
				title='Coin Details Modal'
				open={isOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				centered
				afterClose={() => {
					setTimeRange('1D');
				}}
				width='90%'
				className='coin-detail-modal'
			>
				<div className='coin-detail-wrapper'>
					<img src={modalSelectedCoin.img} width={110} />
					<div>
						<h2>{modalSelectedCoin.coinName}</h2>
						<h3>Current Price:{modalSelectedCoin.currentPrice}</h3>
						<h3>Market Capital:{modalSelectedCoin.marketCapital}</h3>
					</div>
				</div>
				<div>
					<Select
						labelInValue
						value={timeRange}
						defaultValue={[
							{
								value: '1D',
								label: '1D ',
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
								value: '1D',
								label: '1D',
							},
							{
								value: '7D',
								label: '7D',
							},
							{
								value: '1M',
								label: '1M',
							},
							{
								value: '3M',
								label: '3M',
							},
							{
								value: '6M',
								label: '6M',
							},
							{
								value: '1Y',
								label: '1Y',
							},
							{
								value: '3Y',
								label: '3Y',
							},
						]}
					/>
				</div>
				<div>
					<ReactFusioncharts type='line' width='100%' height='100%' dataFormat='JSON' dataSource={chartDataSource} />
				</div>
			</Modal>
		</div>
	);
};
export default CryptoTable;
