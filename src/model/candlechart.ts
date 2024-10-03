import { Candlestick } from "./data"

export type TimeSeriesDay = {
    [date: string]: Candlestick;
}

export type CandleChart = {
    data: TimeSeriesDay;
    lowest: number;
    highest: number;
}
