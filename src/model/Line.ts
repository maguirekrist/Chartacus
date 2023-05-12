import { Drawable, Point } from "./Data";



class Line implements Drawable {
    data: Point;

    constructor(data: Point) {
        this.data = data;
    }

    render(): void {
        console.log("Render Line");
    }
}