#version 400

// texture coordinates from vertex shaders
in vec2 st;

// texture sampler
uniform sampler2D tex;

// output fragment colour RGBA
out vec4 frag_colour;

void main () {
  vec3 colour;
  colour = texture (tex, st).rgb;
  frag_colour = vec4 (colour.r, colour.g, colour.b, 1.0);
}
