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

uniform float ct;
uniform float radius;
uniform float screenWidth;
uniform float screenHeight;

const float PI = 3.1415926535897932384626433832795;

void main () {


  float x = gl_FragCoord.x / screenWidth;
  float y = (gl_FragCoord.y - screenHeight / 2) / screenWidth;
  float a = radius;
  float ct0 = x;
  float ct1 = sqrt((a - y)*(a - y) + x*x);
  float ct2 = sqrt((a + y)*(a + y) + x*x);
  float val = 0.0;;
  
  if (y < a){
    if ((ct < ct0) || (ct > ct2)){
      val = 0.0;
    } else if ( (ct0 <= ct) && (ct <= ct1) ) {
      val = 2.0 * PI;
    } else {
      val = 2.0 * acos( (ct*ct - x*x + y*y - a*a) / (2.0*x*sqrt(ct*ct - x*x)) ); 
    }
  } else if (y > a) {
    if ((ct <= ct1) || (ct > ct2)){
      val = 0.0;
    } else {
      val = 2.0 * acos( (ct*ct - x*x + y*y - a*a) / (2.0*y*sqrt(ct*ct - x*x)) ); 
    }
  } else {
    if ((ct < ct0) || (ct > ct2)){
      val = 0.0;
    } else if ( (ct1 < ct) && (ct <= ct2) ) {
      val = 2.0 * acos( (ct*ct - x*x) / (2.0*a));
    } else {
      val = PI;
    }
  
  }

  frag_colour = HyperbolicGreyScale(val);
  
}
