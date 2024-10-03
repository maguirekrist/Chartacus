import { Candle } from "../model/candle";
import { CandleChart } from "../model/candlechart";
import { Color } from "../model/data";
import { Canvas } from "./canvas";
import { IDrawable, Renderer, RendererVistor } from "./renderer";
import { TextDisplay } from "./text_display";


export class ChartacusEngine {
    private _canvas: Canvas;
    private _renderer: Renderer;
    private _drawables: IDrawable[];
    private _textDisplay: TextDisplay;
    private readonly _clearColor: Color = { 
        r: 1, 
        g: 1,
        b: 0.9,
        a: 1
    };

    private _xScale = 35;

    constructor()
    {
        this._canvas = new Canvas();
        this._canvas.xScale = this._xScale;
        this._renderer = new Renderer(this._canvas);
        this._textDisplay = new TextDisplay();
        this.draw = this.draw.bind(this);
    }

    setChart(chart: CandleChart)
    {
        const values = Object.values(chart.data).reverse();
        const keys = Object.keys(chart.data).reverse();


        var drawables: Candle[] = [];

        //Graph scale is the amount of pixels a whole number change in price represents.
        var graphScale = this._canvas.getCanvas().height / (chart.highest - chart.lowest);

        console.log(`Graph Scale: ${graphScale}`)

        for(var i = 0; i < values.length; i++)
        {
            const trade = values[i];
            const date = keys[i];
            //asume width is 25 px
            var x = i * this._xScale;
            var y = (trade.low - chart.lowest) * graphScale; //the height of the candle is determined by the distance low is from the lowest * graphScale

            var totalChange = trade.high - trade.low;
            var candleHeight = graphScale * totalChange;

            var open = candleHeight - ((trade.high - trade.open) * graphScale);
            var close = candleHeight - ((trade.high - trade.close) * graphScale);

            var candle = new Candle(x, y, { high: candleHeight, open: open, close: close, low: 0}, trade, date);
            drawables.push(candle);
        }

        //high represents the height of the candle from 0
        //open/cose max is going to be a value that is the end of the top body
        //open/close min is going to be the value that is the beginning of the body from 0
        //low will always be normalized to 0, as this marks the beginning
        //the y value will represent the low wick correlated to the actual value of the low trade in the graph context.


        //var testCandle: Candle = new Candle(0, 0, { high: 300, open: 10, close: 260, low: 0 }, {});
        //var testCandle2: Candle = new Candle(35, 0, { high: 168.07, open: 167.13, close: 167.15, low: 166.32 });

        this._canvas.initializeObjectMap(drawables);
        this._drawables = drawables;
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