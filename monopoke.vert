#version 400

layout(location = 0) in vec3 vertex_position;
layout(location = 1) in vec2 radiator_position;

out vec2 rad_pos;

void main () {
  //colour = vertex_colour;
  rad_pos = radiator_position;
  gl_Position = vec4(vertex_position, 1.0);
}
