#version 400

uniform sampler2D tex;

out vec4 frag_colour;

void main() {
  vec3 colour = texture (tex, gl_PointCoord).rgb;
  frag_colour = vec4(0.0,0.0,colour.b,1.0);
}
