#version 400

uniform sampler2D tex;

out vec4 frag_colour;

vec3 orderOfMagnitude(vec3 a) {
  //float b = sqrt(a.r * a.r + a.g * a.g + a.b * a.b);
  float b = a.b;
  vec3 mag = vec3(0.0, 0.0, 0.0);
  if (b > 0.0) {
    float c = log2(b);
    if (c < -32) {
      mag.b = 0.5;
    } else if (c < -16) {
      mag.b = 1.0;
    } else if (c < -8) {
      mag.g = 0.5;
    } else if (c < -4) {
      mag.g = 1.0;
    } else if (c < -2) {
      mag.r = 0.5;
    } else if (c < -1) {
      mag.r = 1.0;
    } else {
      mag = vec3(1.0, 1.0, 1.0);
    }
  }
  return mag;
}
  

void main() {
  vec3 colour = texture (tex, gl_PointCoord).rgb;
  vec3 mag = orderOfMagnitude(colour);
  
  frag_colour = vec4(mag,1.0);
}
