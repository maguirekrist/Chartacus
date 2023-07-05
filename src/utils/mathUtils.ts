import { mat4 } from "gl-matrix";
import { Coordinate, IPositionable } from "../model/data";
import { Object2D } from "../model/object2D";

var m4 = {

    projection: function(width: number, height: number, depth: number) {
      // Note: This matrix flips the Y axis so 0 is at the top.
      let matrix = [
         2 / width, 0, 0, 0,
         0, -2 / height, 0, 0,
         0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
      ];
      let temp = mat4.create();
      mat4.set(temp, 
            matrix[0],
            matrix[1],
            matrix[2],
            matrix[3],
            matrix[4],
            matrix[5],
            matrix[6],
            matrix[7],
            matrix[8],
            matrix[9],
            matrix[10],
            matrix[11],
            matrix[12],
            matrix[13],
            matrix[14],
            matrix[15]
        );
        return temp;
    },
}

export function distance(p1: Coordinate, p2: Coordinate) {
    const dx = p1.x - p2.x, dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
  
export function lerp(p1: Coordinate, p2: Coordinate, t: number) {
    return {x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y};
}
  
export function cross(p1: Coordinate, p2: Coordinate) {
    return p1.x * p2.y - p1.y * p2.x;
}

export function positionableContainsCoordinate(box: Object2D, point: Coordinate): boolean {
    // Calculate the minimum and maximum values for X and Y coordinates of the box
    const xMin = Math.min(box.position.x, box.position.x + box.width);
    const yMin = Math.min(box.position.y, box.position.y - box.height);
    const xMax = Math.max(box.position.x, box.position.x + box.width);
    const yMax = Math.max(box.position.y, box.position.y - box.height);
    
    // Check if the point's coordinates are within the box
    if (point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax) {
        // Point is inside the box
        return true;
    }
    
    // Point is outside the box
    return false;
}

export const mathUtils = {
    m4
}