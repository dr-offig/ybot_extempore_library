#version 400

uniform sampler2D tex;

out vec4 frag_colour;

void main() {
  vec3 colour = texture (tex, gl_PointCoord).rgb;
  if (abs(colour.r) > 1.0 || abs(colour.g) > 1.0 || abs(colour.b) > 1.0) {
    frag_colour = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    if (sign(colour.r) < 0.0) {
      frag_colour = vec4(abs(colour.r),abs(colour.g),abs(colour.b),1.0);
    } else {
      frag_colour = vec4(0.0, 0.0, abs(colour.r),1.0);
    }
  }
}
