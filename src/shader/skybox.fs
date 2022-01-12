/*
 * Original code from three.js r134 cubemap shader
 * - https://github.com/mrdoob/three.js/blob/1a241ef10048770d56e06d6cd6a64c76cc720f95/src/renderers/shaders/ShaderLib/cube.glsl.js
 * Added ability to get mipmapped texture LOD
 */

#include <envmap_common_pars_fragment>

uniform float opacity;
uniform samplerCube envMap;
varying vec3 vWorldDirection;

void main() {
	vec3 vReflect = vWorldDirection;
	#include <envmap_fragment>

  vec4 envColor = textureCubeLodEXT(envMap, vReflect, 10.);
  gl_FragColor = envColor;
  gl_FragColor.a *= opacity;

  #include <tonemapping_fragment>
	#include <encodings_fragment>
}
