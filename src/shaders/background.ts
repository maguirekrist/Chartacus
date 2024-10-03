
export const v_backgroundShaderSource = `#version 300 es

in vec4 a_position;
uniform mat4 view;
uniform mat4 projection;
uniform vec2 u_resolution;

void main() {
    gl_Position = a_position;
}
`;

export const f_backgroundShaderSource = `#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform mat4 view;
uniform mat4 projection;
    
out vec4 outColor;

const int lineWidth      = 1;  // The width of each line (in pixels).

float squareSize = 50.0;

void main() {
    vec2 ndc = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    mat4 vp = projection * view;
    mat4 inverseProjection = inverse(vp);
    vec4 uv = inverseProjection * vec4(ndc.x, ndc.y, 0.0, 1.0); //world-space coordinates

    float zoom = view[0][0];

    //xScale = zoom < 1.0 ? xScale * (1.0 / zoom) : xScale;
    //yScale = zoom < 1.0 ? yScale * (1.0 / zoom) : yScale;

    //uv.xy += (lineWidth > 1) ? vec2(xScale * 0.5, yScale * 0.5) : vec2(xScale, yScale);

    vec4 floored_uv = floor(uv);

    float grid = 0.0;
    grid = mod(floored_uv.x, squareSize) == 0.0 ? 1.0 : grid;
    grid = mod(floored_uv.y, squareSize) == 0.0 ? 1.0 : grid;

    float modX = mod(floored_uv.x, squareSize);
    float modY = mod(floored_uv.y, squareSize);

    if((modX >= (squareSize - 1.0) || modX <= 1.0) || (modY >= (squareSize - 1.0) || modY <= 1.0)) {
        outColor = vec4(1.0, 0.0, 0.0, 1.0);
    } else {
        outColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}
`;