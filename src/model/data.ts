import { IDrawable, RendererVistor } from "../renderer";

export type Color = { 
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface IPositionable {
    x: number;
    y: number;
    width: number;
    height: number;
    z?: number;
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

export class Point implements IDrawable, IPositionable {
    x: number;
    y: number;
    width: number;
    height: number;
    color: Color;
    strokeColor: Color;

    constructor(x: number, y: number, color: Color) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.color = color;
    }

    public getColorAsArray(): number[] {
        return [this.color.r, this.color.g, this.color.b, this.color.a ?? 1.0];
    }

    accept(visitor: RendererVistor): void {
        visitor.draw(this);
    }
}


