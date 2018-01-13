#version 400

uniform float cx;
uniform float cy;
uniform float r;
uniform float value;
uniform int channel;

out vec4 frag_colour = vec4(0.0, 0.0, 0.0, 1.0);

void main() {
  float x = gl_FragCoord.x - 0.5;
  float y = gl_FragCoord.y - 0.5;
  float dx = x - cx;
  float dy = y - cy;
  float p = sqrt(dx*dx + dy*dy);
  if (p < r) {
    if (channel == 0) {
      frag_colour.r = value;
    } else if (channel == 1) {
      frag_colour.g = value;
    } else if (channel == 2) {
      frag_colour.b = value;
    } else {
      frag_colour = vec4(1.0, 1.0, 1.0, 1.0);
    }
  }
      

}
