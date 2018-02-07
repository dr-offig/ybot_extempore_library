#version 400

layout(location = 0) in vec3 vertex_position;
layout(location = 1) in vec4 stuff;
layout(location = 2) in vec2 more_stuff;

out vec4 source_data;
out vec2 more_source_data;

void main () {
  source_data = stuff;
  more_source_data = more_stuff;
  gl_Position = vec4(vertex_position, 1.0);
}

