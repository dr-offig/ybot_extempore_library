#version 400

// uniform float cx;
// uniform float cy;
// uniform float r;
// uniform float value;
// uniform int channel;
uniform float time;
uniform float starttime;
uniform float dur;
uniform float driver_radius;
uniform float Lm;
uniform float L;

uniform sampler1D signal;

out vec4 frag_colour = vec4(0.0, 0.0, 0.0, 1.0);

const  float c = 0.343;

float conform(float x){
  return 0.5 + tanh(x) / 2.;
}


float ac2dc(float x){
  return 0.5 + (x / 2.0);
}

void main() {

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


  vec4 current = texture(signal,s);
  vec4 retard = texture(signal, ping_coord);

  if (p <= event_horizon && p > a) {
    frag_colour = retard / R;
  } else if (p <= a) {
    frag_colour = current;
  } else {
    frag_colour = vec4(0.0, 0.0, 0.0, 1.0);
  }

  //frag_colour = current;
      
}
