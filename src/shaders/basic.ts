export const vertexShaderSource = `#version 300 es
    
in vec4 a_position;
uniform mat4 model;
uniform mat4 projection;
uniform vec2 u_resolution;

void main() {
    float aspectRatio = u_resolution.x / u_resolution.y;
    float aspectRatioY = u_resolution.y / u_resolution.x;

    mat4 newModel = model;

    newModel[0][0] /= aspectRatio;
    //newModel[1][1] = 1.0;

    gl_Position = model * a_position;
}
`;
    
export const fragmentShaderSource = `#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform vec4 color;
uniform vec2 u_resolution;
uniform mat4 model;

const float circleRadius = 0.5;
    
// we need to declare an output for the fragment shader
out vec4 outColor;
    
void main() {
    vec4 circleCenter = model * vec4(0.5, 0.5, 0, 1.0);

    //Normalize
    vec4 normFragCoord = gl_FragCoord / vec4(u_resolution.x, u_resolution.y, 0.0, 0.0);

    //map to NDC
    vec4 ndcFragCoord = normFragCoord * vec4(2, 2, 0, 0);
    ndcFragCoord += vec4(-1, -1, 0, 0);

    float distance = length(ndcFragCoord.xy - circleCenter.xy);

    // if((circleCenter.x >= ndcFragCoord.x -0.05 && circleCenter.x <= ndcFragCoord.x + 0.05) && (circleCenter.y >= ndcFragCoord.y - 0.05 && circleCenter.y <= ndcFragCoord.y + 0.05)) {
    //     outColor = vec4(1.0, 0.0, 0.0, 1.0);
    // } else {
    //     if(distance > (circleRadius * model[0][0])) {
    //         //outColor = vec4(1.0, 1.0, 0.0, 1.0);
    //         discard;
    //     } else {
    //         outColor = color;
    //     }
    // }
    if(distance > (circleRadius * model[0][0])) {
        //outColor = vec4(1.0, 1.0, 0.0, 1.0);
        discard;
    } else {
        outColor = color;
    }
    //outColor = color;
}
`;