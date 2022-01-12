/*
 * Original code from three.js r134 cubemap shader
 * - https://github.com/mrdoob/three.js/blob/1a241ef10048770d56e06d6cd6a64c76cc720f95/src/renderers/shaders/ShaderLib/cube.glsl.js
 */

varying vec3 vWorldDirection;

#include <common>

void main() {
	vWorldDirection = transformDirection(position, modelMatrix);
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w; // set z to camera.far
}
