
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

float xScale = 25.0;
float yScale = 25.0;

void main() {
    vec2 ndc = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    mat4 vp = projection * view;
    mat4 inverseProjection = inverse(vp);
    vec4 uv = inverseProjection * vec4(ndc.x, ndc.y, 0.0, 1.0); //world-space coordinates

    float zoom = view[0][0];

    //xScale = zoom < 1.0 ? xScale * (1.0 / zoom) : xScale;
    //yScale = zoom < 1.0 ? yScale * (1.0 / zoom) : yScale;

    //uv.xy += (lineWidth > 1) ? vec2(xScale * 0.5, yScale * 0.5) : vec2(xScale, yScale);
    
    xScale = 10.0;

    float grid = 0.0;
    grid = mod(floor(uv.x), xScale) == 0.0 ? 1.0 : grid;
    grid = mod(floor(uv.y), yScale) == 0.0 ? 1.0 : grid;

    //grid = float(int(uv.x) % int(xScale) == 0 ? 1.0 : grid);
    //grid = float(int(uv.y) % int(yScale) == 0 ? 1.0 : grid);

	//grid = max(step(uv.x, width), grid); // X lines (horizontal)
	//grid = max(step(uv.y, width), grid); // Y lines (vertical)
    
	vec4 col = vec4(1.0 - grid, 1.0 - grid, 1.0 - grid, 0.5);

    outColor = col;
}
`;