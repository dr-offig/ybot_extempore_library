#version 400

// texture coordinates from vertex shaders
in vec2 st;

// velocity potential textures
uniform sampler2D potential_tex;
uniform sampler2D last_potential_tex;
uniform float dt;

// output fragment colour RGBA
out vec4 frag_colour;


float conform(float x){
  return 0.5 + tanh(x) / 2.;
}

vec4 HyperbolicGreyScale(float x){
  float y = conform(x);
  return vec4(y,y,y,0.0);
}

vec3 HyperbolicRGB(vec3 v){
  float r = conform(v.r);
  float g = conform(v.g);
  float b = conform(v.b);
  return vec3(r,g,b);
}

void main () {
  vec3 colour = texture(potential_tex, st).rgb;
  vec3 last_colour = texture(last_potential_tex, st).rgb;
  float potential = colour.b;
  float last_potential = last_colour.b;
  float vx = dFdx(potential);
  float vy = dFdy(potential);
  float p = (potential - last_potential) / dt;
  
  //vec3 colour = texture (tex, gl_PointCoord).rgb;
  frag_colour = vec4(vx,vy,p,1.0);
  //frag_colour = HyperbolicGreyScale(colour.b);
  //frag_colour = vec4(colour,1.0);


  // if (colour.b < 0.0) {
  //   frag_colour = vec4(0.0, 0.0, abs(colour.b), 1.0);
  // }  else {
  //   frag_colour = vec4(colour.b, colour.b, colour.b, 1.0);
  // }  
   
  //frag_colour = vec4(clamp(colour.rgb, 0.0, 1.0), 1.0);

  
  //frag_colour = vec4(colour.rgb, 1.0);

}
