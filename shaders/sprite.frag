#version 400

uniform sampler2D sprite;

out vec4 frag_colour;

void main() {
  vec3 colour = texture (sprite, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y)).rgb;
  frag_colour = vec4(colour,1.0);
}
