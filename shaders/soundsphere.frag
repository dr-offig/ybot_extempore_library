#version 400

// uniform float cx;
// uniform float cy;
// uniform float r;
// uniform float value;
// uniform int channel;
uniform float time;
//uniform float starttime;
//uniform float dur;
//uniform float driver_radius;
uniform float Lm;
uniform float L;

uniform sampler1D signal0;
uniform sampler1D signal1;
uniform sampler1D signal2;
uniform sampler1D signal3;
uniform sampler1D signal4;
uniform sampler1D signal5;
uniform sampler1D signal6;
uniform sampler1D signal7;

in vec4 source_data;

out vec4 frag_colour = vec4(0.0, 0.0, 0.0, 1.0);

const  float c = 0.0343;

float conform(float x){
  return 0.5 + tanh(x) / 2.;
}


// float ac2dc(float x){
//   return 0.5 + (x / 2.0);
// }

// vec4 ac2dcv(vec4 v) {
//   return vec4(ac2dc(v.r), ac2dc(v.g), ac2dc(v.b), ac2dc(v.a)); 
// }

void main() {

  int slot = int(round(source_data.r));
  float starttime = source_data.g;
  float dur = source_data.b;
  float driver_radius = source_data.a;

  float a = driver_radius / L;
  float x = gl_PointCoord.x;
  float y = gl_PointCoord.y;
  float dx = x - 0.5;
  float dy = y - 0.5;
  float p = sqrt(dx*dx + dy*dy);
  float R = p / a;
  float t = (time - starttime);
  float s = t / dur;
  float ping_time = t - (p * 0.5 * Lm / c);
  float ping_coord = ping_time / dur;
  //float cycles = floor(s);
  float phase = fract(s);
  float event_horizon = (c * t) / (0.5 * Lm);

  //vec4 blergh = texture(signal,s);
  //float q = ac2dc(blergh.r);
  //frag_colour = vec4(q, q, q, 1.0);

  
  vec4 current = texture(signal0,s);
  vec4 retard = texture(signal0, ping_coord);

  if (slot == 1){
    current = texture(signal0,s);
    retard = texture(signal0, ping_coord);
  } else if (slot == 2) {
    current = texture(signal1,s);
    retard = texture(signal1, ping_coord);
  } else if (slot == 3) {
    current = texture(signal2,s);
    retard = texture(signal2, ping_coord);
  } else if (slot == 4) {
    current = texture(signal3,s);
    retard = texture(signal3, ping_coord);
  } else if (slot == 5) {
    current = texture(signal4,s);
    retard = texture(signal4, ping_coord);
  } else if (slot == 6) {
    current = texture(signal5,s);
    retard = texture(signal5, ping_coord);
  } else if (slot == 7) {
    current = texture(signal6,s);
    retard = texture(signal6, ping_coord);
  } else if (slot == 8) {
    current = texture(signal7,s);
    retard = texture(signal7, ping_coord);
  } else {
    current = texture(signal0,s);
    retard = texture(signal0, ping_coord);
  }
  
  if (p <= event_horizon && p > a) {
    frag_colour = vec4((retard / R).rgb,1.0);
  } else if (p <= a) {
    frag_colour = vec4(current.rgb,1.0);
  } else {
    frag_colour = vec4(0.0, 0.0, 0.0, 1.0);
  }

  //frag_colour = current;
      
}
