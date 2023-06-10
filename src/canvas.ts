import { ReadonlyMat4, mat4, vec2, vec3 } from "gl-matrix";
import { mathUtils } from "./utils/mathUtils";
import { IPositionable } from "./model/data";

export class Canvas {
    private canvas: HTMLCanvasElement
    private view: mat4 = mat4.create();
    private projection: mat4;

    private dragging: boolean = false;
    public zoom: number = 1;
    private mousePosition: vec3 = vec3.create();
    public camPos: vec2 = vec2.create();
    private camCenter: vec2 = vec2.create();


    private objectMap: Map<string, IPositionable>;


    constructor() {
        console.log("canvas constructed");
        this.canvas = document.getElementById("c") as HTMLCanvasElement;
        this.canvas.addEventListener('wheel', (event) => this.handleScroll(event));
        this.canvas.addEventListener('mousedown', (event) => this.handleClick(event));
        this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        this.canvas.addEventListener('mouseup', (event) => this.handleMouseUp(event));
        this.canvas.addEventListener('mouseleave', (event) => this.handleMouseLeave(event))
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
        this.objectMap = new Map();

        vec2.set(this.camPos , 0, 0);
        vec2.set(this.camCenter, 
            (this.canvas.clientWidth / 2.0) * this.zoom, 
            (this.canvas.clientHeight / 2.0) * this.zoom);
        this.updateView();
    }

    private handleScroll(event: WheelEvent) {
        if(event.deltaY != 0) {
            if(this.zoom == undefined || this.zoom == 0) {
                this.zoom = 1;
            }
            this.zoom += (event.deltaY / Math.abs(event.deltaY)) * -0.1; //zoom sensitvity
            this.zoom = Math.min(Math.max(0.125, this.zoom), 4); //restrict the zoom level here
            this.zoom = Math.round(this.zoom * 100) / 100;
            //console.log(this.zoom)

            let newCenter = vec2.create();
            vec2.set(newCenter,
                (this.canvas.clientWidth / 2.0) * (1.0 / this.zoom), 
                (this.canvas.clientHeight / 2.0) * ( 1.0 / this.zoom)
            );
            //vec2.add(newCenter, newCenter, this.camPos);
            //console.log(newCenter);

            let diff = vec2.create();
            vec2.subtract(diff, this.camCenter, newCenter);
            vec2.set(this.camCenter, newCenter[0], newCenter[1]);
            //vec2.add(this.camCenter, this.camCenter, diff); //new cam center
            //Update camPos
            vec2.negate(diff, diff);
            //console.log(diff);
            vec2.add(this.camPos, this.camPos, diff);
            //vec2.floor(this.camPos, this.camPos);

            this.updateView();
        }
    }

    private handleClick(event: MouseEvent) {
        if(event.button == 0) {
            this.dragging = true;
            this.toggleDragCursor();
        }
    }

    private handleMouseUp(event: MouseEvent) {
        this.dragging = false;
        this.toggleDragCursor();
    }

    private handleMouseLeave(event: MouseEvent) {
        this.dragging = false;
        this.toggleDragCursor();
    }

    private toggleDragCursor() {
        this.canvas.style.cursor = this.dragging ? "grabbing" : "default";
    }

    private unprojectMouse(event: MouseEvent) {
        //mousePosition in screen space
        vec3.set(this.mousePosition, event.offsetX, this.canvas.clientHeight - event.offsetY, 1.0);
        //mousePosition to ClipSpace
        let u_resolution = vec3.create();
        vec3.set(u_resolution, this.canvas.clientWidth, this.canvas.clientHeight, 1);
        vec3.divide(this.mousePosition, this.mousePosition, u_resolution);
        vec3.scale(this.mousePosition, this.mousePosition, 2.0);
        vec3.set(this.mousePosition, this.mousePosition[0] - 1, this.mousePosition[1] -1, 1);
        let unProjection = mat4.create();
        mat4.multiply(unProjection, this.getProjection(), this.getView());
        mat4.invert(unProjection, unProjection);
        vec3.transformMat4(this.mousePosition, this.mousePosition, unProjection);
    }

    private handleMouseMove(event: MouseEvent) {
        //We want to store mousePosition in world-coordinates not in screen coordinates
        
        //For some reason, camPos is inverted?
        this.unprojectMouse(event);
        
        //console.log(`mouse position: x -> ${this.mousePosition[0]}, y -> ${this.mousePosition[1]}`)

        if(this.dragging) {
            //vec2.set(this.camPos, this.mousePosition[0] / this.canvas.clientWidth, this.mousePosition[1] / this.canvas.clientHeight)
            let changeVec = vec2.create();
            vec2.set(changeVec, event.movementX, event.movementY);
            //console.log(`dragging event: x -> ${event.movementX}, y -> ${event.movementY}`)

            vec2.add(this.camPos, this.camPos, changeVec);
        
            //vec2.add(this.camCenter, this.camCenter, changeVec);
            //console.log(`Cam pos: ${this.camPos[0]}, ${this.camPos[1]}`)
            this.updateView();
        }

        let key = `${Math.floor(this.mousePosition[0] / 25)},${Math.floor(this.mousePosition[1] / 25)}`;

        if(!this.dragging) {
            if(this.objectMap.has(key)) {
                let obj = this.objectMap.get(key);
                this.canvas.style.cursor = "pointer";
            } else {
                this.canvas.style.cursor = "default";
            }
        }

    }

    private handleResize() {
        console.log(`resize: w: ${this.canvas.clientWidth}, h:${this.canvas.clientHeight}, a: ${this.canvas.clientWidth / this.canvas.clientHeight}`)
        this.projection = mathUtils.m4.projection(this.canvas.clientWidth, this.canvas.clientHeight, 400);
        //console.log(this.projection);
    }

    private updateView() {
        var tempView = mat4.create();
        var scaleVec = vec3.create();
        var transVec = vec3.create();
        vec3.set(scaleVec, this.zoom, this.zoom, 1.0);
        vec3.set(transVec, this.camPos[0], this.camPos[1], 1.0);


        mat4.identity(tempView);
        mat4.scale(tempView, tempView, scaleVec);
        mat4.translate(tempView, tempView, transVec);

        this.view = tempView;
    }

    public resizeCanvasToDisplay() {
        const width  = this.canvas.clientWidth | 0;
        const height = this.canvas.clientHeight | 0;
        if (this.canvas.width !== width || this.canvas.height !== height) {
          this.canvas.width  = width;
          this.canvas.height = height;
          return true;
        }
        return false;
    }

    public initializeObjectMap(objects: IPositionable[]): void {
        for(var obj of objects) {
            this.objectMap.set(`${obj.x},${obj.y}`, obj);
        }
    }

    public getCanvas() {
        return this.canvas;
    }


    public getView() { 
        return this.view;
    }

    public getProjection() {
        return this.projection;
    }
      
}
