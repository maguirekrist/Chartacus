import { IDrawable, RendererVistor } from "../Renderer";

export type Color = { 
    r: number;
    g: number;
    b: number;
    a?: number;
}

export class Point implements IDrawable {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    accept(visitor: RendererVistor): void {
        visitor.draw(this);
    }
}


export type Series = Point[];

