import { React, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Modal, Select } from 'antd';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import FusionCharts from 'fusioncharts';
import ReactFusioncharts from 'react-fusioncharts';
import { fromUnixTime, getTime, getUnixTime, sub, format } from 'date-fns';
ReactFusioncharts.fcRoot(FusionCharts, Charts, FusionTheme);

const CryptoTable = () => {
	const [inputVal, setInputVal] = useState('');
	const [dataSource, setDataSource] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [modalSelectedCoin, setModalSelectedCoin] = useState({});
	const [apiData, setApiData] = useState([]);
	const [timeRange, setTimeRange] = useState('1D');
	const [chartData, setChartData] = useState({});

	const chartDataSource = {
		chart: {
			caption: 'Price changes',
			yaxisname: 'price',
			xaxisname: 'time',
			subcaption: '',
			rotatelabels: '1',
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

	const getApiCryptoData = async () => {
		const { data } = await axios.get(
			'https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=100&page=1&sparkline=false'
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
			dataIndex: 'currentPrice',
			key: 'price',
			sorter: {
				compare: (a, b) => a.currentPrice - b.currentPrice,
			},
		},
		{
			title: 'Market Capital',
			dataIndex: 'marketCapital',
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
			};
		});
		setChartData(newConvertedData);
	};
	// const onSortChange = (sorter, extra) => {
	//   console.log("hi am sorting ", sorter, extra);
	// };
	const bubbleSort = (dataArr, order, field) => {
		const newDataArr = [...dataArr];
		const swap = (arr, index1, index2) => {
			let temp = arr[index1];
			arr[index1] = arr[index2];
			arr[index2] = temp;
		};
		if (order === 'lowestFirst') {
			// console.log('hi im bubble sort');
			for (let j = 0; j <= newDataArr.length; j++) {
				for (let i = 0; i < newDataArr.length - 1; i++) {
					if (newDataArr[i][field] > newDataArr[i + 1][field]) {
						swap(newDataArr, i, i + 1);
					}
				}
			}
		} else if (order === 'highestFirst') {
			for (let j = 0; j <= newDataArr.length; j++) {
				for (let i = 0; i < newDataArr.length - 1; i++) {
					if (newDataArr[i][field] < newDataArr[i + 1][field]) {
						swap(newDataArr, i, i + 1);
					}
				}
			}
		}
		setDataSource(newDataArr);
	};
	const onDataChange = (value) => {
		if (value === 'lowestFirstCurrPrice') {
			bubbleSort(dataSource, 'lowestFirst', 'currentPrice');
		} else if (value === 'highestFirstCurrPrice') {
			bubbleSort(dataSource, 'highestFirst', 'currentPrice');
		} else if (value === 'lowestFirstMktCap') {
			bubbleSort(dataSource, 'lowestFirst', 'marketCapital');
		} else if (value === 'highestFirstMktCap') {
			bubbleSort(dataSource, 'highestFirst', 'marketCapital');
		} else if (value === 'lowestFirstChange') {
			bubbleSort(dataSource, 'lowestFirst', 'change');
		} else if (value === 'highestFirstChange') {
			bubbleSort(dataSource, 'highestFirst', 'change');
		}
	};

	return (
		<div>
			<div>
				<input type='search' placeholder='Search Coin' value={inputVal} onChange={handleChange} />
				<div>
					<Select
						defaultValue='Current Price'
						style={{
							width: 134,
						}}
						onChange={(value) => {
							onDataChange(value);
							// console.log(value, ' i m value');
						}}
						options={[
							{
								value: 'currPrice',
								label: 'Current Price',
							},
							{
								value: 'highestFirstCurrPrice',
								label: 'Highest First',
							},
							{
								value: 'lowestFirstCurrPrice',
								label: 'Lowest First',
							},
						]}
					/>
					<Select
						defaultValue='Market Capital'
						style={{
							width: 134,
						}}
						onChange={(value) => {
							onDataChange(value);
						}}
						options={[
							{
								value: 'marketCapital',
								label: 'Market Capital',
							},
							{
								value: 'highestFirstMktCap',
								label: 'Highest First',
							},
							{
								value: 'lowestFirstMktCap',
								label: 'Lowest First',
							},
						]}
					/>
					<Select
						defaultValue='% Change'
						style={{
							width: 134,
						}}
						onChange={(value) => {
							onDataChange(value);
						}}
						options={[
							{
								value: '%Change',
								label: '% Change',
							},
							{
								value: 'highestFirstChange',
								label: 'Highest First',
							},
							{
								value: 'lowestFirstChange',
								label: 'Lowest First',
							},
						]}
					/>
				</div>
			</div>
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
			<Modal
				title='Coin Details Modal'
				open={isOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				centered
				afterClose={() => {
					setTimeRange('1D');
				}}
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
