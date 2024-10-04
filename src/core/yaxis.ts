import { GraphRange } from "./range";


export class YAxisView {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private _range: GraphRange;

    constructor(range: GraphRange)
    {
        this._range = range;
        this.canvas = document.getElementById("yaxis") as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener('wheel', (event) => this.handleScroll(event));
        this.canvas.addEventListener('mouseenter', (event) => this.handleEnter(event));
        this.canvas.addEventListener('mouseleave', (event) => this.handleLeave(event));
    }

    draw()
    {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.textBaseline = "top";
        this.context.fillText(`${this._range.end.toFixed(2)}`, 0, 0);

        //Fill out the range!
        var canvasHeight = this.context.canvas.height;
        var rangeGap = (this._range.end - this._range.begin);
        var rangeGapWhole = Math.floor(rangeGap);
        var textMetrics = this.context.measureText(`${this._range.end.toFixed(2)}`);
        const textHeight = (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) + 10; //adds 10px gap

        //Figure out how many labels we could technically render
        var labelCount = Math.min(Math.floor(canvasHeight / textHeight), rangeGapWhole); //This should represent the MAXIMUM number of labels we could present
        //Calculate the change in label value for each label
        var valueChange = rangeGap / labelCount;

        for(var i = 1; i < labelCount; i++)
        {
            var y = i * textHeight;
            var label = Math.floor(this._range.end - (valueChange * i));
                
            this.context.fillText(`${label.toFixed(0)}`, 0, y);
        }

        this.context.textBaseline = "bottom";
        this.context.fillText(`${this._range.begin.toFixed(2)}`, 0, this.context.canvas.height);
    }

    handleScroll(event: WheelEvent)
    {
        if(event.deltaY != 0) {
            var scrollDelta = (event.deltaY / Math.abs(event.deltaY)) * -0.1; 
            if(this._range.delta > 1 || Math.sign(scrollDelta) == -1) {
                this._range.update((this._range.begin + scrollDelta ), (this._range.end - scrollDelta));
                this.draw();
            }
        }
    }

    private handleEnter(event: MouseEvent)
    {
        this.canvas.style.cursor = "ns-resize"
    }

    private handleLeave(event: MouseEvent)
    {
        this.canvas.style.cursor = "default";
    }
}