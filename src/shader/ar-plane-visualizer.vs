#version 300 es
precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;

in vec3 position;
in vec2 uv;
out vec3 worldPos;
out vec2 vuv;

void main() {
  worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vuv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
