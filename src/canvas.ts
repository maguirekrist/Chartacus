import { ReadonlyMat4, mat4, vec2, vec3 } from "gl-matrix";

export class Canvas {
    private canvas: HTMLCanvasElement
    private view: mat4 = mat4.create();

    private dragging: boolean = false;
    private zoom: number = 1;
    private mousePosition: vec2 = vec2.create();
    private camPos: vec2 = vec2.create();

    constructor() {
        console.log("canvas constructed");

        vec2.set(this.camPos , 0, 0);

        this.canvas = document.getElementById("c") as HTMLCanvasElement;
        this.canvas.addEventListener('wheel', (event) => this.handleScroll(event));
        this.canvas.addEventListener('mousedown', (event) => this.handleClick(event));
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        this.canvas.addEventListener('mouseleave', (event) => this.handleMouseLeave(event))
    }

    private handleScroll(event: WheelEvent) {
        if(event.deltaY != 0) {
            if(this.zoom == undefined || this.zoom == 0) {
                this.zoom = 1;
            }

            this.zoom += (event.deltaY / Math.abs(event.deltaY)) * -0.1; //zoom sensitvity
            this.zoom = Math.min(Math.max(0.125, this.zoom), 4); //restrict the zoom level here
        }
    }

    private handleClick(event: MouseEvent) {
        if(event.button == 0) {
            this.dragging = true;
        }
    }

    private handleMouseUp(event: MouseEvent) {
        this.dragging = false;
    }

    private handleMouseLeave(event: MouseEvent) {
        this.dragging = false;
    }

    private handleMouseMove(event: MouseEvent) {
        
        //console.log(`mouse move: x -> ${event.offsetX}, y -> ${this.canvas.clientHeight - event.offsetY}`)
        vec2.set(this.mousePosition, event.offsetX, this.canvas.clientHeight - event.offsetY);
        if(this.dragging) {
            console.log(`mouse move last: ${event.movementX}, ${event.movementY}`)
            //vec2.set(this.camPos, this.mousePosition[0] / this.canvas.clientWidth, this.mousePosition[1] / this.canvas.clientHeight)
            let changeVec = vec2.create();
            vec2.set(changeVec, event.movementX / this.canvas.clientWidth, -event.movementY / this.canvas.clientHeight);
            vec2.add(this.camPos, this.camPos, changeVec);
        }
    }

    public resizeCanvasToDisplay() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    public getCanvas() {
        return this.canvas;
    }


    public getView() { 
        var tempView = mat4.create();
        var scaleVec = vec3.create();
        var transVec = vec3.create();
        vec3.set(scaleVec, this.zoom, this.zoom, 1.0);
        vec3.set(transVec, this.camPos[0], this.camPos[1], 1.0);

        mat4.identity(tempView);
        mat4.scale(tempView, tempView, scaleVec);
        mat4.translate(tempView, tempView, transVec);

        return tempView;
    }
}
