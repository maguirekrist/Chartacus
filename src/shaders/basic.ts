export const vertexShaderSource = `#version 300 es
    
in vec4 a_position;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec2 u_resolution;

void main() {
    gl_Position = projection * view * model * a_position;
}
`;
    
export const fragmentShaderSource = `#version 300 es
// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

uniform vec4 color;
uniform vec4 strokeColor;
uniform vec2 u_resolution;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
    
const float strokeSize = 8.0;

// we need to declare an output for the fragment shader
out vec4 outColor;
    
void main() {
    vec4 center =  model * vec4(0.5, 0.5, 0.0, 1.0); //This value is in NDC

    mat4 vp = projection * view;

    vec2 ndc = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    mat4 inverseProjection = inverse(vp);
    vec4 uv = inverseProjection * vec4(ndc.x, ndc.y, 0.0, 1.0);

    float distance = length(uv.xy - center.xy);

    if(distance > (25.0 / 2.0)) {
        outColor = vec4(1.0, 0.0, 0.0, 1.0);
        discard;
    } else if(distance > (25.0 - strokeSize) / 2.0) {
        outColor = strokeColor;
    } else {
        outColor = color;
    }
    //outColor = color;
}
`;