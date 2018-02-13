#version 400

layout(location = 0) in vec2 vertex_position;
layout(location = 1) in vec2 vs_tex_coord;
layout(location = 2) in vec3 vs_source_position;
layout(location = 3) in vec4 vs_source_data;
layout(location = 4) in vec4 vs_more_source_data;

out vec2 tex_coord;
out vec3 source_position;
out vec4 source_data;

void main () {
  tex_coord = vs_tex_coord;
  source_position = vs_source_position;
  source_data = vs_source_data;

  gl_Position = vec4(vertex_position, 1.0);
}

