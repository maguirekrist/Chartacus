# Chartacus - WebGL2 Candlestick chart renderer

![Screenshot 2024-10-04 at 3 13 28 PM](https://github.com/user-attachments/assets/989c97e2-bc5d-43be-92e3-3212e5318f46)

Chartacus is a WebGL2 and Canvas2D based Candlestick chart renderer. Largely inspired by [Lightweight Charts by TradingView](https://github.com/tradingview/lightweight-charts).

## Features

- Supports both Vertical and Horizontal zoom / scrolling, allowing you to easily focus in on a section of the chart.
- Easy API, simply call setChart with our chart datatype and begin interacting.
- Alphavantage API wrapper and schema converter to Chartacus candlestick chart format.
- Mouse picking, supports clicking on a candle for it's raw data.
- Mouse dragging, allowing you to pan around the chart with ease.

## TODO

- Custom Cursor that displays current position data based on graph scale state.
- Live text display for current candle you are hovering
- Volume bar graph overlay
- Data streaming support for incremental updates
- Interday trade data support (and other time scale options)
- Grid lines
- Custom annotations (draw splines, add points, add text notes, etc.)
