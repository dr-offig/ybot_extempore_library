#version 400

// texture coordinates from vertex shaders
in vec2 st;

// texture sampler
uniform sampler2D tex;

// output fragment colour RGBA
out vec4 frag_colour;


float conform(float x){
  return 0.5 + tanh(x) / 2.;
}

vec4 HyperbolicGreyScale(float x){
  float y = conform(x);
  return vec4(y,y,y,1.0);
}

vec3 HyperbolicRGB(vec3 v){
  float r = conform(v.r);
  float g = conform(v.g);
  float b = conform(v.b);
  return vec3(r,g,b);
}

void main () {
  vec3 colour = texture(tex, st).rgb;
  //vec3 colour = texture (tex, gl_PointCoord).rgb;
  //frag_colour = vec4(HyperbolicRGB(colour),1.0);
  frag_colour = HyperbolicGreyScale(colour.b);
  //frag_colour = vec4(colour,1.0);


  // if (colour.b < 0.0) {
  //   frag_colour = vec4(0.0, 0.0, abs(colour.b), 1.0);
  // }  else {
  //   frag_colour = vec4(colour.b, 0.0, 0.0, 1.0);
  // }  
   
  //frag_colour = vec4(clamp(colour.rgb, 0.0, 1.0), 1.0);

  
  //frag_colour = vec4(colour.rgb, 1.0);

}
