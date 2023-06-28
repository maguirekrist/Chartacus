import * as _ from "lodash";
import { IDrawable, RendererVistor } from "../renderer";
import { CandleStock, Color, IPositionable } from "./data";

export class Candle implements IDrawable, IPositionable {
    x: number;
    y: number;
    width: number;
    height: number;
    z?: number;
    trade: CandleStock;
    color: Color;

    constructor(x: number, y: number, trade: CandleStock) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = this.calculateCandleHeight(trade);
        this.trade = trade;
        this.color = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };
    }

    private calculateCandleHeight(trade: CandleStock): number {
        const keys = _.keys(trade);
        const smallestKey = _.minBy(keys, key => _.get(trade, key)) as keyof CandleStock;
        const largestKey = _.maxBy(keys, key => _.get(trade, key)) as keyof CandleStock;
        return trade[largestKey] - trade[smallestKey];
    }

    getColorAsArray(): Float32List {
        return [this.color.r, this.color.g, this.color.b, this.color.a ?? 1.0];
    }

    accept(visitor: RendererVistor): void {
        visitor.drawCandle(this);
    }
}