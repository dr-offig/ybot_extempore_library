#version 400

in vec3 colour;
out vec4 frag_colour;

void main () {

  //float ggrr = clamp(gl_FragCoord.x / 1000.0,0.0,1.0);
  //float bbll = clamp(gl_FragCoord.y / 1000.0,0.0,1.0);
  //frag_colour = vec4(colour.x, ggrr, bbll, 1.0);
  frag_colour = vec4(colour,1.0);
}
