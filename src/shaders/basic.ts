export const vertexShaderSource = `#version 300 es
    
in vec4 a_position;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec2 u_resolution;

void main() {
    gl_Position = projection * model * a_position;
}
`;
    
export const fragmentShaderSource = `#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform vec4 color;
uniform vec2 u_resolution;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

const float circleRadius = 0.5;
    
// we need to declare an output for the fragment shader
out vec4 outColor;
    
void main() {
    // float aspect = u_resolution.x / u_resolution.y;
    // vec4 circleCenter = projection * view * model * vec4(0.5, 0.5, 0, 1.0); //This value is in NDC

    // mat4 mvp = projection * view * model;
    // float adjustedRadius = circleRadius * model[0][0];

    // //Normalize
    // vec2 ndc = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    // // vec2 ndc = normFragCoord * vec2(2, 2);
    // // ndc += vec2(-1, -1);

    // ndc.x -= circleCenter.x;
    // ndc.x *= aspect;
    // ndc.x *= 1.0 / view[0][0];
    // ndc.x += circleCenter.x;

    // ndc.y -= circleCenter.y;
    // ndc.y /= view[1][1];
    // ndc.y += circleCenter.y;

    // //ndc.y /= aspect;
    
    // float distance = length(ndc - circleCenter.xy);

    
    // if((circleCenter.x >= ndc.x -0.05 && circleCenter.x <= ndc.x + 0.05) && (circleCenter.y >= ndc.y - 0.05 && circleCenter.y <= ndc.y + 0.05)) {
    //     outColor = vec4(1.0, 0.0, 0.0, 1.0);
    // } else {
    //     if(distance > (adjustedRadius)) {
    //         outColor = vec4(1.0, 1.0, 0.0, 1.0); 
    //     } else {
    //         outColor = color;
    //     }
    // }

    // if(distance > (circleRadius * mvp[0][0])) {
    //     outColor = vec4(1.0, 1.0, 0.0, 1.0); 
    // } else {
    //     outColor = color;
    // }

    // if(distance > (circleRadius * viewModel[0][0]) && distance > (circleRadius * viewModel[1][1]) ) {
    //     outColor = vec4(1.0, 0.0, 0.0, 1.0);
    // } else {
    //     outColor = color;
    // }
    outColor = color;
}
`;