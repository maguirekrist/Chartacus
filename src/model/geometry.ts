import { BufferAttribute } from "./data";


export class BufferGeometry {
    attribute: BufferAttribute;
    count: number;

    constructor(count: number, buffer: BufferAttribute) {
        this.attribute = buffer;
        this.count = count;
    }

    setAttribute(buffer: BufferAttribute) { 
        this.attribute = buffer;
    }
}