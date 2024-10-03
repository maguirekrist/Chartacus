import { mat4 } from "gl-matrix";

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

export const mathUtils = {
    m4
}