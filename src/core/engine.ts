import { Candle } from "../model/candle";
import { CandleChart } from "../model/candlechart";
import { Color } from "../model/data";
import { Canvas } from "./canvas";
import { GraphRange, Observer } from "./range";
import { IDrawable, Renderer, RendererVistor } from "./renderer";
import { TextDisplay } from "./text_display";
import { XAxisView } from "./xaxis";
import { YAxisView } from "./yaxis";


export class ChartacusEngine implements Observer {
    private _canvas: Canvas;
    private _renderer: Renderer;
    private _drawables: IDrawable[];
    private _textDisplay: TextDisplay;
    private _xAxis: XAxisView;
    private _yAxis: YAxisView;

    private _yRange: GraphRange = new GraphRange(0, 0);
    private _xRange: GraphRange = new GraphRange(0, 0);
    private _chart: CandleChart;

    private readonly _clearColor: Color = { 
        r: 1, 
        g: 1,
        b: 0.9,
        a: 1
    };

    private _xScale = 5;

    constructor()
    {
        this._yRange.addObserver(this);
        this._xRange.addObserver(this);
        this._canvas = new Canvas(this._yRange, this._xRange);
        this._canvas.xScale = this._xScale;
        this._renderer = new Renderer(this._canvas);
        this._textDisplay = new TextDisplay();

        this._xAxis = new XAxisView(this._xRange);
        this._yAxis = new YAxisView(this._yRange);
        this.draw = this.draw.bind(this);
    }

    notify(): void {
        this.updateChart();
    }

    setChart(chart: CandleChart)
    {
        this._chart = chart;
        this._yRange.update(chart.lowest, chart.highest);
        this._xRange.update(0, Object.values(chart.data).length);

        //Parse Dates
        const keys = Object.keys(chart.data).reverse();
        var dates: Date[] = [];

        for(const key of keys)
        {
            var date = new Date(key);
            dates.push(date);
        }

        this._xAxis.setDates(dates);

        this.updateChart();
    }

    private updateChart()
    {
        var drawables: Candle[] = [];
        const values = Object.values(this._chart.data).reverse();
        const keys = Object.keys(this._chart.data).reverse();

        const graphScale = this._canvas.getCanvas().height / (this._yRange.end - this._yRange.begin);
        const graphWidth = this._canvas.getCanvas().width;
        const candleWidth = graphWidth / this._xRange.delta;

        console.log(this._xRange);

        for(var i = 0; i < values.length; i++)
        {
            var index = this._xRange.begin + i;
            if(index >= 0 && index < values.length) {
                const trade = values[index];
                const date = keys[index];
                //asume width is 25 px
                var x = i * candleWidth;
                var y = (trade.low - this._yRange.begin) * graphScale; //the height of the candle is determined by the distance low is from the lowest * graphScale
    
                var totalChange = trade.high - trade.low;
                var candleHeight = graphScale * totalChange;
    
                var open = candleHeight - ((trade.high - trade.open) * graphScale);
                var close = candleHeight - ((trade.high - trade.close) * graphScale);
    
                var candle = new Candle(x, y, candleWidth, { high: candleHeight, open: open, close: close, low: 0}, trade, date);
                drawables.push(candle);
            }
        }

        this._canvas.initializeObjectMap(drawables);
        this._drawables = drawables;

        this._xAxis.draw();
        this._yAxis.draw();
    }

    run() {
        //this._canvas.initializeObjectMap([originPoint, testCandle]);
        requestAnimationFrame(this.draw);
    }

    draw(time: number) {
        time *= 0.001;

        
    
        this._canvas.resizeCanvasToDisplay();
        const gl = this._canvas.getGlContext();
        
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this._textDisplay.updateText(this._canvas.camPos[0], this._canvas.camPos[1], this._canvas.zoom);

        gl.clearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearColor.a);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.drawAllDrawables(this._drawables, this._renderer);

        requestAnimationFrame(this.draw);
    }

    private drawAllDrawables(elements: IDrawable[], renderer: RendererVistor) {
        for(let elem of elements) {
            elem.accept(renderer);
        }
    }
}