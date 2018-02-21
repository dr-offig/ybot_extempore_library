#version 400


uniform float time;
//uniform float Lm;
//uniform float L;
//uniform float mmpp;
//uniform float c;
const float c = 343.0;

uniform sampler1D wavetable0;
uniform sampler1D wavetable1;
uniform sampler1D wavetable2;
uniform sampler1D wavetable3;
uniform sampler1D wavetable4;
uniform sampler1D wavetable5;
uniform sampler1D wavetable6;
uniform sampler1D wavetable7;

in vec2 tex_coord;
in vec3 source_position;   // position of speaker element in millimetres (from bottom left of screen)
in vec4 source_data;        // all lengths in millimetres, times in milliseconds
in vec2 more_source_data; 

out vec4 frag_colour = vec4(0.0, 0.0, 0.0, 0.5);

float conform(float x){
  return 0.5 + tanh(x) / 2.;
}


void main() {

  //float x = gl_FragCoord.x * mmpp;
  //float y = gl_FragCoord.y * mmpp;
  float x = tex_coord.x;
  float y = tex_coord.y;
  float dx = x - source_position.x;
  float dy = y - source_position.y;

  int slot = int(round(source_data.r));     // which wavetable to look up
  float starttime = source_data.g;           
  float dur = source_data.b;
  float a = source_data.a;  // driver_radius in millimetres
  float phase = more_source_data.x;
  float invert = more_source_data.y;
  float r = sqrt(dx*dx + dy*dy);
  float attenuation = a / r;

  float t = (time - starttime);
  float ct = c * t;
  float retarded_time = t - ((r-a) / c);
  float current_phase = t / dur;
  float retarded_phase = retarded_time / dur;

  vec4 current = texture(wavetable0, current_phase);
  vec4 retard = texture(wavetable0, retarded_phase);
  
  if (slot == 1){
    current = texture(wavetable0,current_phase);
    retard = texture(wavetable0, retarded_phase);
  } else if (slot == 2) {
    current = texture(wavetable1,current_phase);
    retard = texture(wavetable1, retarded_phase);
  } else if (slot == 3) {
    current = texture(wavetable2,current_phase);
    retard = texture(wavetable2, retarded_phase);
  } else if (slot == 4) {
    current = texture(wavetable3,current_phase);
    retard = texture(wavetable3, retarded_phase);
  } else if (slot == 5) {
    current = texture(wavetable4,current_phase);
    retard = texture(wavetable4, retarded_phase);
  } else if (slot == 6) {
    current = texture(wavetable5,current_phase);
    retard = texture(wavetable5, retarded_phase);
  } else if (slot == 7) {
    current = texture(wavetable6,current_phase);
    retard = texture(wavetable6, retarded_phase);
  } else if (slot == 8) {
    current = texture(wavetable7,current_phase);
    retard = texture(wavetable7, retarded_phase);
  } else {
    current = texture(wavetable0,current_phase);
    retard = texture(wavetable0, retarded_phase);
  }

  if (r < a) {
    frag_colour = vec4(0.0, 0.0, current.b * invert, 0.5);
  } else if (r <= a + ct) {
    frag_colour =  vec4(0.0, 0.0, retard.b * attenuation * invert, 0.5);
    //frag_colour = vec4(1.0,1.0,1.0,1.0);
  } else {
    frag_colour = vec4(0.0, 0.0, 0.0, 0.5);
  }

  //frag_colour = vec4(current.b, 0.0, 0.0, 1.0);

  
}
