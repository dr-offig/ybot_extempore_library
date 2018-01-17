#version 400

out vec4 frag_colour;

// texture sampler
uniform sampler2D tex;
uniform float dt;
//uniform float mpp;
uniform float Lm;

const float PI = 3.14159;
const float rho = 1.186;
const float c = 343.0;
const float k = 0.000007;

// precalculate 1 / (rho.k)
const float DpDrho = 120452.9;
//const float DpDrho = 1.0;

// gain factor applied to actual pressure to help conditioning
const float g = 0.002655;

// some precalculated values
const float alpha = -319.1931;
const float beta = -376.6478;

/*
float squidge(float x) {
  return 0.5 + tanh(x) / 2.;
}

float unsquidge(float y) {
  atanh(2.0 * y - 1.0);
}


vec4 squidge(vec4 v) {
  return vec4(squidge(v.r), squidge(v.g), squidge(v.b), squidge(v.a));
}

vec4 unsquidge(vec4 w) {
  return vec4(unsquidge(w.r), unsquidge(w.g), unsquidge(w.b), unsquidge(w.a));
}
*/

void main() {
  //float x = gl_FragCoord.x - 0.5;
  //float y = gl_FragCoord.y - 0.5;
  float pcx = gl_PointCoord.x;
  float pcy = gl_PointCoord.y;
  ivec2 sz = textureSize(tex,0);
  float x = pcx * sz.x;
  float y = pcy * sz.y;

  /*----- Testing coordinate values -----
  float fx = fract(x) - 0.5;
  float fy = fract(y) - 0.5;

  if (abs(fx) < 0.01 && abs(fy) < 0.01)
    frag_colour = vec4(0.0,1.0,0.0,1.0);
  else
    frag_colour = vec4(0.0,0.0,0.0,1.0);
  --------------------------------------------*/
  
  float dx = 1.0 / float(sz.x);
  float dy = 1.0 / float(sz.y);
  float Dx = Lm * dx;
  float Dy = Lm * dy;
  float Dz = Dx;
  //float Dz = 1.0;
  
  //sample the soundfield at the centre of this fluid element
  vec4 sf = texture(tex, gl_PointCoord);
  
  // Determine which fluid element this is
  // float i = round( (x + 0.5*dx) * float(sz.x) );
  // float j = round( (y + 0.5*dy) * float(sz.y) );
  float i = ceil(x);
  float j = ceil(y);

  // find the midpoints of the edges of this fluid element
  vec2 hijL = vec2((i - 1.0)/sz.x, (j - 0.5)/sz.y);
  vec2 hijR = vec2(i/sz.x, (j - 0.5)/sz.y);
  vec2 hijD = vec2((i - 0.5)/sz.x, (j - 1.0)/sz.y);
  vec2 hijU = vec2((i - 0.5)/sz.x, j/sz.y);

  
  // interpolate the soundfield to the midpoints of the fluid element edges
  vec4 sf_left = texture(tex, hijL);
  vec4 sf_right = texture(tex, hijR);
  vec4 sf_up = texture(tex, hijU);
  vec4 sf_down = texture(tex,hijD);
  
  //frag_colour = vec4(sf_left.r - sf_right.r) + (sf_down.g - sf_up.g);

  // The material flux into the fluid element centred on e_ij is
  // (under the approximation that rho ~ rho_0
  // rho_0 [ v_x(h_ijL) - v_x(h_ijR)    +   v_y(h_ijD) - v_y(h_ijU) ] * Dx * Dy * dt
  //float mass_flux = ( (sf_left.r - sf_right.r) + (sf_down.g - sf_up.g) ) * Dx * Dy * dt;

  // The new density is
  // (mass + mass_flux) / volume
  //float new_density = (old_density * DV  + mass_flux) / (Dx * Dy * Dz) = old_density   +  mass_flux / DV
  float d_rho = ( (sf_left.r - sf_right.r) + (sf_down.g - sf_up.g) ) * dt / Dz;
  float dp = DpDrho * d_rho;

  // Calculate the gradient of the pressure field (stored in blue channel of soundfield)
  // at each edge midpoint
  float DpxDx = (sf_right.b - sf_left.b) / Dx;
  float DpyDy = (sf_up.b - sf_down.b) / Dy;
  vec2 nablap = vec2(DpxDx, DpyDy);

  // Newtons law
  vec2 dv = (-1.0 / rho) * nablap * dt;

  vec2 v = sf.rg + dv;
  float p = sf.b + dp;
  
  frag_colour = vec4(sf.rg + dv, sf.b + dp,1.0);

  /*  
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
    frag_colour = vec4(v,p,1.0);
  */

}
