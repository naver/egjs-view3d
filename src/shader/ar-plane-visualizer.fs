#version 300 es
precision highp float;

in vec3 worldPos;
in vec2 vuv;
out vec4 fragColor;

void main() {
  vec3 worldPos10 = worldPos * 10.0;
  vec3 gridPos = pow(abs(worldPos10 - round(worldPos10)), vec3(4.0));
  float gridAlpha = pow(10.0 * max(gridPos.x, gridPos.z), 2.0);
  float isHighlight = 1.0 - smoothstep(0.35, 0.4, gridAlpha);
  vec3 gridColor = vec3(0, 1, 1) * isHighlight + vec3(1, 1, 1) * (1.0 - isHighlight);
  float outCircle = 1.0 - smoothstep(0.2, 0.25, pow(vuv.x - 0.5, 2.0) + pow(vuv.y - 0.5, 2.0));

  fragColor = vec4(gridColor, gridAlpha * outCircle);
}
