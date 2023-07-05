import { mat4 } from "gl-matrix";
import { IDrawable, RendererVistor } from "../renderer";

export type Color = { 
    r: number;
    g: number;
    b: number;
    a?: number;
}

export type Coordinate = {
    x: number;
    y: number;
}

export interface IPositionable {
    position: Coordinate;
    width: number;
    height: number;
    matrix: mat4;
    z?: number;

}

export type BufferAttribute = {
    vertices: ArrayBuffer;
    size: number;
    type: number;
    normalize: boolean;
    offset?: number;
    stride?: number;
}

export class Grid implements IDrawable {
    scale: number;

    constructor(scale: number) {
        this.scale = scale;
    }

    accept(visitor: RendererVistor): void {
        visitor.drawGrid(this);
    }
}


