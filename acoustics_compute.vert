#version 400

layout(location = 0) in vec3 vertex_position;
layout(location = 1) in vec4 vertex_soundfield;
layout(location = 2) in vec2 vertex_tex_coord;

out vec4 soundfield;
out vec2 tex_coord;


void main () {

  // pass through variables (also interpolates)
  tex_coord = vertex_tex_coord;
  soundfield = vertex_soundfield;

  // no funny biz
  gl_Position = vec4(vertex_position, 1.0);
}
