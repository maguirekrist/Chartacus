
export const v_candleShaderSource = `#version 300 es

in vec4 a_position;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec2 u_resolution;

void main() {
    gl_Position = projection * view * model * a_position;
}
`;

export const f_candleShaderSource = `#version 300 es

precision highp float;

uniform vec4 color;
uniform vec2 u_resolution;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform vec4 u_candleData;

// we need to declare an output for the fragment shader
out vec4 outColor;
    
void main() {
    float high = u_candleData.x;
    float open = u_candleData.y;
    float close = u_candleData.z;
    float low = u_candleData.w;

    vec4 top =  model * vec4(0.0, 0.0, 0.0, 1.0); //This value is in world coordinates
    vec4 center = model * vec4(0.5, 0.5, 0.0, 1.0);
    mat4 vp = projection * view;

    vec2 ndc = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
    mat4 inverseProjection = inverse(vp);
    vec4 worldCoord = inverseProjection * vec4(ndc.x, ndc.y, 0.0, 1.0);

    vec2 vecFromTop = worldCoord.xy - top.xy;
    float distance = length(worldCoord.xy - top.xy);

    //Y direction moves down
    vec4 candleColor = (close > open) ? vec4(0.0, 1.0, 0.0, 1.0) : vec4(1.0, 0.0, 0.0, 1.0);

    float bodyTop = max(close, open);
    float bodyBottom = min(close, open);
    
    float wickWidth = 0.5;

    if(vecFromTop.y >= bodyTop) {
        if(worldCoord.x <= (center.x + wickWidth) && worldCoord.x >= (center.x - wickWidth)) {
            outColor = candleColor;
        } else {
            discard;
        }
    } else if(vecFromTop.y <= bodyBottom) {
        if(worldCoord.x <= (center.x + wickWidth) && worldCoord.x >= (center.x - wickWidth)) {
            outColor = candleColor;
        } else {
            discard;
        }
    } else {
        outColor = candleColor;
    }
}
`;