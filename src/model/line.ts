import { Point } from "./data";



class Line  {
    data: Point;

    constructor(data: Point) {
        this.data = data;
    }

    render(): void {
        console.log("Render Line");
    }
}