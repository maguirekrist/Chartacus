import { Dictionary } from "lodash";
import { CandleChart } from "../model/candlechart";
import { Candlestick } from "../model/data";
import { mockAlphavantageResponse } from "../utils/mocks";

interface MetaData {
    "1. Information": string;
    "2. Symbol": string;
    "3. Last Refreshed": string;
    "4. Output Size": string;
    "5. Time Zone": string;
}

interface DailyData {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
}

interface TimeSeries {
    [date: string]: DailyData;
}

export interface StockData {
    "Meta Data": MetaData;
    "Time Series (Daily)": TimeSeries;
}

type Tickers = "IBM" | "AAPL";

export class AlphavantageApi {
    private readonly _key = "E65L3KEHIYJK9L0U";
    private _cache: Dictionary<StockData>;
    private _useMock: boolean = true;


    constructor()
    {
        this._cache = {};
    }

    async getTimeSeriesDaily(ticker: Tickers): Promise<CandleChart>
    {
        var data: StockData;
        if(this._useMock)
        {
            data = mockAlphavantageResponse;         
        } else {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${this._key}`);

            if(!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
    
            data = (await response.json()) as StockData;
        }

        try {
            const chart = this.parseTimeSeries(data["Time Series (Daily)"]);

            return chart;
        } catch(err) {
            throw new Error("API Limit reached!")
        }
    }

    private parseTimeSeries(series: TimeSeries) : CandleChart
    {
        var chart: CandleChart = {
            data: {},
            lowest: Number.MAX_VALUE,
            highest: Number.MIN_VALUE
        };
        const keys = Object.keys(series);
        for(const key of keys)
        {
            var dailyData: DailyData = series[key];
            var candleStick: Candlestick = {
                high: parseFloat(dailyData["2. high"]),
                open: parseFloat(dailyData["1. open"]),
                close: parseFloat(dailyData["4. close"]),
                low: parseFloat(dailyData["3. low"])
            }
            
            chart.lowest = Math.min(chart.lowest, candleStick.close, candleStick.low, candleStick.open, candleStick.high);
            chart.highest = Math.max(chart.highest, candleStick.close, candleStick.low, candleStick.open, candleStick.high);

            chart.data[key] = candleStick;
        }

        return chart;
    }
}