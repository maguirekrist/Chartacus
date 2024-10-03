import { AlphavantageApi } from "../api/alphavantage";
import { Point } from "../model/data";

export const stockApi = new AlphavantageApi();

function GenerateRandomPoints(amt: number) : Point[] {
    let points: Point[] = [];

    const getRandomPoint = (): Point => {
        return new Point(
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            {
                r: Math.random(),
                g: Math.random(),
                b: Math.random()
            }
        )
    }

    for(var i = 0; i < amt; i++) {
        points.push(getRandomPoint());
    }

    return points;
}