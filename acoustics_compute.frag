#version 400

//in vec4 soundfield;  // soundfield values passed in from vertex shader
//in vec2 tex_coord;  // texture coordinate passed in from vertex shader

out vec4 frag_colour;

// texture sampler
uniform sampler2D accumulator;
uniform float dt;
//uniform float mpp;
uniform float Lm;

/*
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
*/

  
const float PI = 3.14159;
const float rho = 1.186;
const float c = 343.0;
const float k = 0.000007;

// gain factor applied to actual pressure to help conditioning
const float g = 0.002655;

// some precalculated values
const float alpha = -319.1931;
const float beta = -376.6478;

// with this substitution (i.e. p => p * g) the acoustic equations are:
//   dv / dt =  (-1 / (rho * g)) * nablap       or     dv = dt * alpha * grad_p
//   dp / dt =              (-g/k) * nabladotv              dp = dt * beta * div_v


//const float gamma = -0.000006;
//const float gamma = -1.0;


// rgba <=> [vx vy vz g*p]

// dv / dt = - rho grad p
// we first need to calculate the gradient of the alpha coordinate
// gradient of a single dimension function f(n) is
// f'(n) = 0.5 * (f(n+1) - f(n-1)) for interior points 0 < n < max
// f'(0) = f(1) - f(0)  at left edge
// f'(max) = f(max) - f(max-1) at right edge


void main() {
  //float x = gl_FragCoord.x - 0.5;
  //float y = gl_FragCoord.y - 0.5;
  float x = gl_PointCoord.x;
  float y = 1.0 - gl_PointCoord.y;
  ivec2 sz = textureSize(accumulator,0);
  float dx = 1.0 / float(sz.x);
  float dy = 1.0 / float(sz.y);
  float Dx = Lm * dx;
  float Dy = Lm * dy;
  
  // Sample the soundfield at this point, and the 4 nearest neighbors up/down/left/right
  vec4 soundfield = texture (accumulator, vec2(x, y)).rgba;
  vec4 sf_up;
  vec4 sf_down;
  vec4 sf_left;
  vec4 sf_right;
  
  if (x > 0.0) sf_left = texture(accumulator,vec2(x - dx, y));
  else sf_left = soundfield;

  if (x < 1.0) sf_right = texture(accumulator, vec2(x + dx, y));
  else sf_right = soundfield;
  
  if (y > 0.0) sf_down = texture(accumulator, vec2(x, y - dy));
  else sf_down = soundfield;

  if (y < 1.0) sf_up = texture(accumulator, vec2(x, y + dy));
  else sf_up = soundfield;


  //vec2 grad_p = vec2(dFdx(soundfield.b),dFdy(soundfield.b));
  //float div_v = dFdx(soundfield.r) + dFdy(soundfield.g);

  // Calculate the gradient of the pressure field (stored in blue channel of soundfield)
  // Also calculate the divergence of the velocity field
  // vx = red channel and vy = green channel of soundfield
  float dp_x;
  float dp_y;
  float dvx_x;
  float dvy_y;
  
  
  if (x > 0.0 && x < 1.0) {
    dp_x = 0.5 * (sf_right.b - sf_left.b) * Dx;
    dvx_x = 0.5 * (sf_right.r - sf_left.r) * Dx;
  } else if (x < 1.0) {
    dp_x = (sf_right.b - soundfield.b) * Dx;
    dvx_x = (sf_right.r - soundfield.r) * Dx;
  } else {
    dp_x = (soundfield.b - sf_left.b) * Dx;
    dvx_x = (soundfield.r - sf_left.r) * Dx;
  }
  
  if (y > 0.0 && y < 1.0) {
    dp_y = 0.5 * (sf_up.b - sf_down.b) * Dy;
    dvy_y = 0.5 * (sf_up.g - sf_down.g) * Dy;
  } else if (y < 1.0) {
    dp_y = (sf_up.b - soundfield.b) * Dy;
    dvy_y = (sf_up.g - soundfield.g) * Dy;
  } else {
    dp_y = (soundfield.b - sf_down.b) * Dy;
    dvy_y = (soundfield.g - sf_down.g) * Dy;
  }
  
  vec2 grad_p = vec2(dp_x, dp_y);
  float div_v = dvx_x + dvy_y;

 
  // Apply fundamental equations of acoustics!
  vec2 dv = dt * alpha * grad_p;        // conservation of momentum (F = ma)
  float dp = dt * beta  * div_v;         // conservation of mass

  // now update the soundfield
  vec2 v = soundfield.rg + dv;
  float p = soundfield.b + dp;
  //frag_colour = vec4(1.0,1.0,1.0,1.0);
  
  frag_colour = vec4(v,p,1.0);                              
  //frag_colour = vec4(v,p,1.0);

  // float spill_x = abs(fract(x-0.5));
  // float spill_y = abs(fract(y-0.5));
  // if (spill_x > 0.0)
  //   frag_colour.r = 0.0;

  // if (spill_y > 0.0)
  //     frag_colour.g = 0.0;

      //frag_colour = vec4(dv,dp,1.0);
}

/*
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

  frag_colour = vec4(gl_FragCoord.x, gl_FragCoord.y,0.0,1.0);
  
} */
