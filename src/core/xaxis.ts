import { GraphRange } from "./range";

//UTILS

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export class XAxisView {
    private canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D;

    private _range: GraphRange;
    private _dates: Date[];

    constructor(xRange: GraphRange)
    {
        this._range = xRange;
        this.canvas = document.getElementById("xaxis") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener('wheel', (event) => this.handleScroll(event));
        this.canvas.addEventListener('mouseenter', (event) => this.handleEnter(event));
        this.canvas.addEventListener('mouseleave', (event) => this.handleLeave(event));
    }

    setDates(dates: Date[])
    {
        this._dates = dates;
        this.draw();
    }

    draw()
    {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.textBaseline = "top";
        //this.context.fillText("Test", 0, 0);


        if(this._dates != null) {
            const candleWidth = this.canvas.width / this._range.delta;
            
            //Calculate how many dates we're probably going to render
            const candles = this.canvas.width / candleWidth;
            const avgMetric = this.context.measureText("22");
            const avgWidth = avgMetric.width;

            // check for overcrowding
            const spaceNeeded = candles * (avgWidth + (candleWidth / 2))
            const skipCount = Math.ceil(Math.max(spaceNeeded / this.canvas.width, 1));

            var lastMonth: number | undefined = undefined;
            for(var i = 0; i < this._dates.length; i += skipCount)
            {
                var index = this._range.begin + i;
                if(index >= 0 && index < this._dates.length)
                {
                    var label = this._dates[index].getDate();
                    var month = this._dates[index].getMonth();
                    const textMetrics = this.context.measureText(`${label}`);
                    var x = (i * candleWidth) + ((candleWidth / 2) - (textMetrics.width / 2));
    
                    if(month !== lastMonth) {
                        var monthName = monthNames[month];
                        this.context.fillText(`${monthName}`, x, 25);
                        lastMonth = month;
                    }
    
                    this.context.fillText(`${label}`, x, 0);
                }
            }
        }
    }

    handleScroll(event: WheelEvent)
    {
        if(event.deltaY != 0) {
            var scrollDelta = (event.deltaY / Math.abs(event.deltaY)) * -0.8; 
            if(this._range.delta > 1) {
                this._range.update(this._range.begin, this._range.end + scrollDelta);
                this.draw();
            }
        }
    }

    private handleEnter(event: MouseEvent)
    {
        this.canvas.style.cursor = "ew-resize"
    }

    private handleLeave(event: MouseEvent)
    {
        this.canvas.style.cursor = "default"
    }
}