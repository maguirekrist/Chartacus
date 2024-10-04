import * as _ from "lodash";
import { IDrawable, RendererVistor } from "../core/renderer";
import { Candlestick, Color, IPositionable } from "./data";
import { mat4, vec3 } from "gl-matrix";

export class Candle implements IDrawable, IPositionable {
    x: number;
    y: number;
    width: number;
    height: number;
    z?: number;

    originalTrade: Candlestick;
    date: string;

    trade: Candlestick;
    color: Color;
    
    modelMat: mat4;

    constructor(x: number, y: number, width: number, trade: Candlestick, original: Candlestick, date: string) {
        this.x = x;
        this.y = y;
        this.originalTrade = original;
        this.width = width;
        this.height = trade.high;
        this.trade = trade;
        this.date = date;
        this.color = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

        const vec3Scale = vec3.create();
        vec3.set(vec3Scale, this.width, this.height, 0); //this is our scale value, needs to be configurable I

        const vec3trans = vec3.create();
        vec3.set(vec3trans, this.x, this.y, 0);

        const mat = mat4.create();
        mat4.identity(mat);

        mat4.translate(mat, mat, vec3trans);
        mat4.scale(mat, mat, vec3Scale);

        this.modelMat = mat;
    }

    getColorAsArray(): Float32List {
        return [this.color.r, this.color.g, this.color.b, this.color.a ?? 1.0];
    }

    accept(visitor: RendererVistor): void {
        visitor.drawCandle(this);
    }
}