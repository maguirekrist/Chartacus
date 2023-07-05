import { mat4, vec2, vec3 } from "gl-matrix";
import { IDrawable, RendererVistor } from "../renderer";
import { Coordinate, IPositionable } from "./data";
import { BufferGeometry } from "./geometry";
import { Material } from "./material";


export class Object2D implements IPositionable {
    position: Coordinate;
    width: number;
    height: number;
    matrix: mat4;
    rotation?: number;
    scale?: number = 1.0;
    name?: string;

    updateMatrix() {
        const vec3Scale = vec3.create();
        vec3.set(vec3Scale, this.scale, this.scale, 0); //this is our scale value, needs to be configurable I

        const vec3trans = vec3.create();
        vec3.set(vec3trans, this.position.x, this.position.y, 0);

        const mat = mat4.create();
        mat4.identity(mat);

        //This order matters?
        mat4.translate(mat, mat, vec3trans);
        mat4.scale(mat, mat, vec3Scale);
        //mat4.rotate(mat, mat, this.rotation, [0, 0, 1]);
        this.matrix = mat;
    }

    translateX(x: number) {
        this.position.x += x;
        this.updateMatrix();
    }

    translateY(y: number) {
        this.position.y += y;
        this.updateMatrix();
    }

    rotate(rad: number) {
        this.rotation += rad;
        this.updateMatrix();
    }   
    
}