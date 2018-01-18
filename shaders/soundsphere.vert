#version 400

layout(location = 0) in vec3 vertex_position;
layout(location = 1) in vec4 stuff;

out vec4 source_data;

void main () {
  source_data = stuff;
  gl_Position = vec4(vertex_position, 1.0);
}
