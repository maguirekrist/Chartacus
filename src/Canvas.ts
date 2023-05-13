
export class Canvas {
    public canvas: HTMLCanvasElement

    constructor() {
        this.canvas = document.getElementById("c") as HTMLCanvasElement;
        this.canvas.addEventListener('scroll', this.handleScroll);
    }

    private handleScroll() {
        console.log("scroll handled")
    }

    public resizeCanvasToDisplay() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
}
