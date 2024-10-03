import { ChartacusEngine } from "./core/engine";
import { CandleChart } from "./model/candlechart";
import { stockApi } from "./utils/globals";


function main() {
        const engine = new ChartacusEngine();

        // var points: Point[] = GenerateRandomPoints(10);
        // var originPoint: Point = new Point(0, 0, { r: 0.0, g: 0.0, b: 1.0 });
        // //var grid: Grid = new Grid(1.0);

        // var testCandle: Candle = new Candle(0, 10, { high: 300, open: 290, close: 10, low: 0 });

        // var renderables: IDrawable[] = [originPoint, testCandle];

        stockApi.getTimeSeriesDaily("IBM").then((res: CandleChart) => {
            console.log(res)
            engine.setChart(res);
            engine.run();
        });

        // canvas.initializeObjectMap([originPoint, testCandle]);
        //engine.run();
}


main();