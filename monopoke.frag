#version 400

in vec2 rad_pos;
out vec4 frag_colour;

vec3 HUEtoRGB(float H){
  float R = abs(H * 6. - 3.) - 1.;
  float G = 2 - abs(H * 6. - 2.);
  float B = 2 - abs(H * 6. - 4.);
  return clamp(vec3(R,G,B),0.0,1.0);
}

vec3 HSLtoRGB(vec3 HSL){
  vec3 RGB = HUEtoRGB(HSL.x);
  float C = (1. - abs(2. * HSL.z - 1.)) * HSL.y;
  return (RGB - 0.5) * C + HSL.z;
}

float conform(float x){
  return 0.5 + tanh(x) / 2.;
}

vec4 HyperbolicGreyScale(float x){
  float y = conform(x);
  return vec4(y,y,y,1.0);
}

uniform int num_pokes;
uniform float ct;
uniform float radius;
uniform float screenWidth;
uniform float screenHeight;

const float PI = 3.1415926535897932384626433832795;

void main () {

  float x_offset = (screenWidth - screenHeight) / (2.0 * screenHeight);
  float x = (gl_FragCoord.x / screenHeight) - x_offset;
  float b = abs((gl_FragCoord.y - (screenHeight / 2)) / screenHeight);
  float y = abs(((gl_FragCoord.y - (screenHeight / 2)) / screenHeight) - rad_pos.y);
  float a = radius;
  float ct0 = x;
  float ct1 = sqrt((a - y)*(a - y) + x*x);
  float ct2 = sqrt((a + y)*(a + y) + x*x);
  float val = 0.0;
  //int N = num_pokes;
  int N = 1;
  
  if (y < a){
    if ((ct < ct0) || (ct > ct2)){
      val = 0.0;
    } else if ( (ct0 <= ct) && (ct <= ct1) ) {
      val = 1.0;
    } else {
      val = acos( (ct*ct - x*x + y*y - a*a) / (2.0*y*sqrt(ct*ct - x*x))) / PI;
    }
  } else if (y > a) {
    if ((ct <= ct1) || (ct > ct2)){
      val = 0.0;
    } else {
      val = acos( (ct*ct - x*x + y*y - a*a) / (2.0*y*sqrt(ct*ct - x*x))) / PI; 
    }
  } else {
    if ((ct < ct0) || (ct > ct2)){
      val = 0.0;
    } else if ( (ct1 < ct) && (ct <= ct2) ) {
      val = acos( (ct*ct - x*x) / (2.0*a)) / PI;
    } else {
      val = 0.5;
    }
  
  }

  //frag_colour = HyperbolicGreyScale(val);

  /*
  */
  float v = val / N;
  
  if ((b > 0.495) || (x > 0.995)) {
    frag_colour = vec4(1.0,1.0,1.0,1.0);
  } else if (x < 0.005) {
    frag_colour = vec4(1.0,1.0,1.0,1.0);
  } else if (x < 0.01) {
    if (y < a) {
      frag_colour = vec4(1.0,1.0,0.0,1.0);
    } else {
        frag_colour = vec4(0.0,0.0,0.0,0.0);
    }
  } else {

    if (v > 1.0){
      frag_colour = vec4(1.0,0.0,0.0,1.0);
    } else if (v < 0.0){
      frag_colour = vec4(0.0,0.0,1.0,1.0);
    } else {
      frag_colour = vec4(v,v,v,1.0);
    }
  }
    
}
