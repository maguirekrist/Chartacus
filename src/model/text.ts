import { IDrawable, RendererVistor } from "../renderer";
import { Polygon } from "./polygon";
import { Font, Path } from 'opentype.js';
import earcut from 'earcut';
import { Coordinate } from "./data";
import { Object2D } from "./object2D";

export class Text extends Object2D implements IDrawable {
    text: string;
    width: number;
    height: number;

    //Rendering data
    polys: Polygon[] = [];
    font: Font;
    path: Path;
    totalPoints: number;
    vertexData: Float32Array;
    indexData: any;
    vertexCount = 0;
    indices: number[] = [];

    constructor(text: string, font: Font, position?: Coordinate) {
        super();
        this.text = text;
        this.font = font;
        this.position = position ?? { x: 0, y: 0 };

        this.path = this.font.getPath(this.text, 0, 0, 40);
        this.path.commands.forEach((command) => {
            switch(command.type) {
                case 'M':
                    this.polys.push(new Polygon());
                    this.polys[this.polys.length - 1].moveTo({x: command.x, y: command.y});
                    break;
                  case 'L':
                    this.polys[this.polys.length - 1].moveTo({x: command.x, y: command.y});
                    break;
                  case 'C':
                    this.polys[this.polys.length - 1].cubicTo({x: command.x, y: command.y}, {x: command.x1, y: command.y1}, {x: command.x2, y: command.y2});
                    break;
                  case 'Q':
                    this.polys[this.polys.length - 1].conicTo({x: command.x, y: command.y}, {x: command.x1, y: command.y1});
                    break;
                  case 'Z':
                    this.polys[this.polys.length - 1].close();
                    break;
            }
        });

        const boundingBox = this.path.getBoundingBox();
        console.log(boundingBox)

        // Calculate the width and height
        this.width = boundingBox.x2 - boundingBox.x1;
        this.height = boundingBox.y2 - boundingBox.y1;

        console.log(`Text box: width: ${this.width}, height: ${this.height}`)

        this.updateMatrix();


        // sort contours by descending area
        this.polys.sort((a, b) => Math.abs(b.area) - Math.abs(a.area));
        // classify contours to find holes and their 'parents'
        const root = [];
        for (let i = 0; i < this.polys.length; ++i) {
            let parent = null;
            for (let j = i - 1; j >= 0; --j) {
                // a contour is a hole if it is inside its parent and has different winding
                if (this.polys[j].inside(this.polys[i].points[0]) && this.polys[i].area * this.polys[j].area < 0) {
                    parent = this.polys[j];
                    break;
                }
            }
            if (parent) {
                parent.children.push(this.polys[i]);
            } else {
                root.push(this.polys[i]);
            }
        }

        this.totalPoints = this.polys.reduce((sum, p) => sum + p.points.length, 0);
        this.vertexData = new Float32Array(this.totalPoints * 2);
        this.vertexCount = 0;
        this.indices = []

        const process = (poly: Polygon) => {
            // construct input for earcut
            const coords: any[] = [];
            const holes: number[] = [];
            poly.points.forEach(({x, y}) => coords.push(x, y));
            poly.children.forEach(child => {
              // children's children are new, separate shapes
              child.children.forEach(process);
              
              holes.push(coords.length / 2);
              child.points.forEach(({x, y}) => coords.push(x, y));
            });
            
            // add vertex data
            this.vertexData.set(coords, this.vertexCount * 2);
            // add index data
            earcut(coords, holes).forEach(i => this.indices.push(i + this.vertexCount));
            this.vertexCount += coords.length / 2;
        }
        root.forEach(process);

        this.indexData = new Uint16Array(this.indices);
    }

    accept(visitor: RendererVistor): void {
        visitor.drawText(this);
    }

}
