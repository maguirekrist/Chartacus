export const v_textShaderSource = `#version 300 es
precision mediump float;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
in vec2 position;

void main() {
  gl_Position = projection * view * model * vec4(position, 0.0, 1.0);
}
`;

export const f_textShaderSource = `#version 300 es
precision mediump float;
uniform vec4 color;
out vec4 outColor;
void main() {
  outColor = color;
}
`;


